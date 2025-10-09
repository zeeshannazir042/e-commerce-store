import React from 'react'

const CategoryForm = ({ value, setValue, handleSubmit, button = 'Submit', handleDelete }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center">
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter category name"
            className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />  
        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {button}
        </button>
        {handleDelete && (
          <button
              type="button"
                onClick={handleDelete}
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Delete
            </button>
        )}
      </div>
    </form>

    
  )
}

export default CategoryForm