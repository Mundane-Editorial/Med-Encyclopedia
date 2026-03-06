import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              MedEncyclopedia
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Educational platform providing structured information about
              medicines and compounds.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/compounds"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Compounds
                </Link>
              </li>
              <li>
                <Link
                  href="/medicines"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/contribute"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/disclaimer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Important
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This site provides educational information only. Always consult
              qualified healthcare professionals for medical advice.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} MedEncyclopedia. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            For educational purposes only. Not medical advice.
          </p>
          <br />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Made with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/uday-kumar-rana/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-blue-500 transition"
            >
              Uday Rana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
