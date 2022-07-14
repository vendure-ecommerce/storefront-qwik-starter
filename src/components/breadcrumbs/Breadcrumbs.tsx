import { component$ } from '@builder.io/qwik';

export default component$<{ items: { name: string; slug: string; id: string }[] }>(({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1 md:space-x-4">
        <li>
          <div>
            <a href="/" className="text-gray-400 hover:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {items
          .filter((item) => item.name !== '__root_collection__')
          .map((item, index) => (
            <li key={item.name}>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a
                  href={'/collections/' + item.slug}
                  className="ml-2 md:ml-4 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </a>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
});
