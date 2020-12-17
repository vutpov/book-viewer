# book-viewer

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/book-viewer.svg)](https://www.npmjs.com/package/book-viewer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

``` bash
npm install --save book-viewer
```

## Usage

``` tsx
import React, { Component } from 'react'

import {BookViewer} from 'book-viewer'
import 'rc-slider/assets/index.css';
import 'book-viewer/dist/index.css';

class Example extends Component {
  render() {
    return <BookViewer src={[]} />
  }
}
```

## License

MIT © [vuthpov](https://github.com/vuthpov)
