const { nanoid } = require('nanoid');
const books = require('./books');
const {
	addBookHandlerResponse,
	editBookByIdHandlerResponse,
} = require('./responses');

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	// List responses
	const response = addBookHandlerResponse(
		request.payload,
		newBook,
		h
	);

	return response;
};

const getAllBooksHandler = (request, h) => {
	const listQueryParams = ['name', 'reading', 'finished'];

	let filteredBooks = books;

	// return h.query;
	if (request.query.name !== undefined) {
		const temp = [];
		filteredBooks.map((book) => {
			const findName = book.name
				.toLowerCase()
				.includes(request.query.name);
			if (findName) {
				temp.push(book);
			}
		});
		filteredBooks = temp;
	}
	if (request.query.reading !== undefined) {
		const temp = [];
		filteredBooks.map((book) => {
			const isReading = request.query.reading;
			if (isReading == 1 && book.reading) {
				temp.push(book);
			} else if (isReading == 0 && !book.reading) {
				temp.push(book);
			}
		});

		if (temp.length > 0) {
			filteredBooks = temp;
		}
	}

	if (request.query.finished !== undefined) {
		const temp = [];
		filteredBooks.map((book) => {
			const isFinished = request.query.finished;
			if (isFinished == 1 && book.finished) {
				temp.push(book);
			} else if (isFinished == 0 && !book.finished) {
				temp.push(book);
			}
		});

		if (temp.length > 0) {
			filteredBooks = temp;
		}
	}

	// Return id, name, publisher

	const data = [];
	filteredBooks.forEach((book) => {
		data.push({
			id: book.id,
			name: book.name,
			publisher: book.publisher,
		});
	});

	const response = h.response({
		status: 'success',
		data: {
			books: books.length === 0 ? [] : data,
		},
	});
	response.code(200);
	return response;
};

const getBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const book = books.find((n) => n.id === bookId);

	if (book !== undefined) {
		return {
			status: 'success',
			data: {
				book: book,
			},
		};
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	const response = editBookByIdHandlerResponse(
		request.payload,
		index,
		h
	);
	return response;
};

const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	editBookByIdHandler,
	getBookByIdHandler,
	getAllBooksHandler,
	deleteBookByIdHandler,
};
