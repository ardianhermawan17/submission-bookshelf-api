const books = require('./books');

function addBookHandlerResponse(payload, newBook, h) {
	const { name, pageCount, readPage } = payload;

	// List responses
	if (name === null || name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	} else {
		books.push(newBook);
		const isSuccess =
			books.filter((book) => book.id === newBook.id).length > 0;

		if (isSuccess) {
			const response = h.response({
				status: 'success',
				message: 'Buku berhasil ditambahkan',
				data: {
					bookId: newBook.id,
				},
			});
			response.code(201);
			return response;
		}

		const response = h.response({
			status: 'fail',
			message: 'Catatan gagal ditambahkan',
		});
		response.code(500);
		return response;
	}
}

function editBookByIdHandlerResponse(payload, index, h) {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = payload;
	const updatedAt = new Date().toISOString();

	// List responses
	if (name === null || name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	} else if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
}

module.exports = {
	addBookHandlerResponse,
	editBookByIdHandlerResponse,
};
