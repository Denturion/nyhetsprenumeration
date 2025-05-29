export const SingleArticlePage = () => {
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-4xl font-bold mb-4'>Single Article Page</h1>
			<p className='text-lg'>This is a single article page.</p>
			<div className='bg-white p-6 rounded shadow-md w-80 mt-4'>
				<h2 className='text-2xl font-semibold mb-2'>Article Title</h2>
				<p className='text-gray-700 mb-4'>
					This is the content of the article. It contains detailed information
					and insights on the topic.
				</p>
				<button className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'>
					Read More
				</button>
			</div>
		</div>
	);
};
