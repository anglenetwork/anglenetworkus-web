export default function FontDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Google Fonts Demo</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Merriweather</h2>
          <p className="font-merriweather text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-merriweather font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-merriweather font-bold">
            Bold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">IBM Plex Serif</h2>
          <p className="font-ibm-plex-serif text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-ibm-plex-serif font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-ibm-plex-serif font-semibold">
            Semibold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Prata</h2>
          <p className="font-prata text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Playfair Display</h2>
          <p className="font-playfair-display text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-playfair-display font-medium">
            Medium weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-playfair-display font-bold">
            Bold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Inter</h2>
          <p className="font-inter text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-inter font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-inter font-medium">
            Medium weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-inter font-bold">
            Bold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Manrope</h2>
          <p className="font-manrope text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-manrope font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-manrope font-semibold">
            Semibold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Sora</h2>
          <p className="font-sora text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-sora font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-sora font-semibold">
            Semibold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Outfit</h2>
          <p className="font-outfit text-lg">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>
          <p className="font-outfit font-light">
            Light weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-outfit font-medium">
            Medium weight: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-outfit font-bold">
            Bold weight: The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <code>font-merriweather</code> - For serif headings and body text
          </li>
          <li>
            <code>font-ibm-plex-serif</code> - For professional serif text
          </li>
          <li>
            <code>font-prata</code> - For elegant display text
          </li>
          <li>
            <code>font-playfair-display</code> - For sophisticated headings
          </li>
          <li>
            <code>font-inter</code> - For clean, modern UI text (default sans)
          </li>
          <li>
            <code>font-manrope</code> - For modern, geometric text
          </li>
          <li>
            <code>font-sora</code> - For contemporary, clean text
          </li>
          <li>
            <code>font-outfit</code> - For versatile, modern text
          </li>
        </ul>
      </div>
    </div>
  );
}
