interface Category {
  slug: string;
  name: string;
  views?: number;
}

interface Tag {
  slug: string;
  title: string;
  views?: number;
}

interface FooterProps {
  categories: Category[];
  tags: Tag[];
}

export function Footer({ categories, tags }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-red-500 mb-4">POLITICO</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The essential source for political news and analysis in Washington
              and around the world.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-4">Sections</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.slice(0, 5).map((category) => (
                  <li key={category.slug}>
                    <a
                      href={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-white capitalize"
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Congress
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      White House
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Defense
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Energy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Health Care
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Topics */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-4">Topics</h4>
            <ul className="space-y-2 text-sm">
              {tags.length > 0 ? (
                tags.slice(0, 5).map((tag) => (
                  <li key={tag.slug}>
                    <a
                      href={`/tag/${tag.slug}`}
                      className="text-gray-300 hover:text-white capitalize"
                    >
                      {tag.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      POLITICO Pro
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Playbook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Newsletters
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Magazine
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Events
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 POLITICO LLC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
