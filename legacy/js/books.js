/* books.js — Book catalogue & inventory (demo)
   Backend must enforce authorization and run this logic server-side. */

function allBooks() {
  return window.__sraswati_storage.readCollection('books', []);
}

function allCopies() {
  return window.__sraswati_storage.readCollection('copies', []);
}

function allCategories() {
  return window.__sraswati_storage.readCollection('categories', []);
}

function findBook(id) {
  return allBooks().find((b) => b.id === id);
}

function findCopy(id) {
  return allCopies().find((c) => c.id === id);
}

function copiesForBook(bookId) {
  return allCopies().filter((c) => c.bookId === bookId);
}

function inventoryForBook(bookId) {
  const copies = copiesForBook(bookId);
  return {
    total: copies.length,
    available: copies.filter((c) => c.status === 'available').length,
    issued: copies.filter((c) => c.status === 'issued').length,
    reserved: copies.filter((c) => c.status === 'reserved').length,
    damaged: copies.filter((c) => c.status === 'damaged').length,
  };
}

function searchBooks({ q, category, available } = {}) {
  let list = allBooks();
  if (q) {
    const term = String(q).toLowerCase();
    list = list.filter((b) =>
      b.title.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.isbn.toLowerCase().includes(term) ||
      b.publisher.toLowerCase().includes(term) ||
      (b.category && b.category.toLowerCase().includes(term))
    );
  }
  if (category && category !== 'All') {
    list = list.filter((b) => b.category === category);
  }
  if (available === 'true') {
    list = list.filter((b) => inventoryForBook(b.id).available > 0);
  }
  return list;
}

function createBook(data) {
  const books = allBooks();
  if (data.isbn && books.find((b) => b.isbn === data.isbn && b.id !== data.id)) {
    return { ok: false, error: 'A book with this ISBN already exists' };
  }
  const book = {
    id: 'bk_' + Math.random().toString(36).slice(2, 10),
    title: data.title,
    author: data.author,
    isbn: data.isbn || '',
    category: data.category || '',
    publisher: data.publisher || '',
    description: data.description || '',
    edition: data.edition || '1st',
    publishedYear: data.publishedYear || '',
    totalCopies: Number(data.totalCopies) || 1,
    cover: data.cover || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  };
  books.push(book);
  window.__sraswati_storage.writeCollection('books', books);
  // Create copies
  const copies = allCopies();
  for (let i = 0; i < book.totalCopies; i++) {
    copies.push({
      id: 'cp_' + Math.random().toString(36).slice(2, 10),
      bookId: book.id,
      copyNo: i + 1,
      status: 'available',
      acquiredAt: new Date().toISOString(),
    });
  }
  window.__sraswati_storage.writeCollection('copies', copies);
  window.__sraswati_audit('books.create', { bookId: book.id, title: book.title });
  return { ok: true, book, copies: copiesForBook(book.id) };
}

function updateBook(id, data) {
  const books = allBooks();
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return { ok: false, error: 'Book not found' };
  const book = books[idx];
  if (data.isbn && data.isbn !== book.isbn && books.find((b) => b.isbn === data.isbn && b.id !== id)) {
    return { ok: false, error: 'A book with this ISBN already exists' };
  }
  Object.assign(book, data, { updatedAt: new Date().toISOString() });
  books[idx] = book;
  window.__sraswati_storage.writeCollection('books', books);
  window.__sraswati_audit('books.edit', { bookId: id, title: book.title });
  return { ok: true, book };
}

function archiveBook(id) {
  const books = allBooks();
  const book = books.find((b) => b.id === id);
  if (!book) return { ok: false, error: 'Book not found' };
  const activeLoans = window.__sraswati_storage.readCollection('loans', []).filter(
    (l) => l.bookId === id && l.status === 'active'
  );
  if (activeLoans.length > 0) {
    return { ok: false, error: 'Cannot archive a book with active loans. Return all copies first.' };
  }
  book.archived = true;
  book.archivedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('books', books);
  window.__sraswati_audit('books.archive', { bookId: id, title: book.title });
  return { ok: true };
}

function addCopy(bookId, data) {
  const copies = allCopies();
  const maxNo = copies.filter((c) => c.bookId === bookId).reduce((m, c) => Math.max(m, c.copyNo || 0), 0);
  const copy = {
    id: 'cp_' + Math.random().toString(36).slice(2, 10),
    bookId,
    copyNo: maxNo + 1,
    status: data.status || 'available',
    acquiredAt: new Date().toISOString(),
    conditionNote: data.conditionNote || '',
  };
  copies.push(copy);
  window.__sraswati_storage.writeCollection('copies', copies);
  window.__sraswati_audit('inventory.manage', { bookId, copyId: copy.id, action: 'addCopy' });
  return { ok: true, copy };
}

function removeCopy(copyId) {
  const copies = allCopies();
  const copy = copies.find((c) => c.id === copyId);
  if (!copy) return { ok: false, error: 'Copy not found' };
  if (copy.status === 'issued') {
    return { ok: false, error: 'Cannot remove an issued copy' };
  }
  const idx = copies.findIndex((c) => c.id === copyId);
  copies.splice(idx, 1);
  window.__sraswati_storage.writeCollection('copies', copies);
  window.__sraswati_audit('inventory.manage', { bookId: copy.bookId, copyId, action: 'removeCopy' });
  return { ok: true };
}

function setCopyStatus(copyId, status) {
  const copies = allCopies();
  const copy = copies.find((c) => c.id === copyId);
  if (!copy) return { ok: false, error: 'Copy not found' };
  copy.status = status;
  copy.updatedAt = new Date().toISOString();
  window.__sraswati_storage.writeCollection('copies', copies);
  window.__sraswati_audit('inventory.manage', { bookId: copy.bookId, copyId, action: 'setStatus', status });
  return { ok: true, copy };
}

function createCategory(data) {
  const cats = allCategories();
  const cat = { id: 'cat_' + Math.random().toString(36).slice(2, 10), name: data.name, createdAt: new Date().toISOString() };
  cats.push(cat);
  window.__sraswati_storage.writeCollection('categories', cats);
  return { ok: true, cat };
}

window.__sraswati_books = {
  allBooks, allCopies, allCategories, findBook, findCopy, copiesForBook,
  inventoryForBook, searchBooks, createBook, updateBook, archiveBook,
  addCopy, removeCopy, setCopyStatus, createCategory,
};
