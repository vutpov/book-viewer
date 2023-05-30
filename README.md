# book-viewer

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/book-viewer.svg)](https://www.npmjs.com/package/book-viewer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save book-viewer
```

## Usage

```tsx
import React, { Component } from "react";

import { FlipBook, BookProvider } from "book-viewer";
import "book-viewer/dist/style.css";

class Example extends Component {
  render() {
    return (
      <BookProvider>
        <FlipBook src={[]} />
      </BookProvider>
    );
  }
}
```

## License

MIT © [vuthpov](https://github.com/vuthpov)
