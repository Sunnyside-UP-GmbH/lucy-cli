
import { polyfillWebCrypto } from 'expo-standard-web-crypto';
// import { Platform } from 'react-native';
// // import polyfill from 'react-native-polyfill-globals';
// import { TextDecoder, TextEncoder } from "text-encoding";
// // require('node-libs-react-native/globals');
// if (typeof TextEncoder === "undefined") {
//     Object.defineProperty(window, "TextEncoder", {
//         configurable: true,
//         enumerable: true,
//         get: () => TextEncoder,
//     });
// }

// if (typeof TextDecoder === "undefined") {
//     Object.defineProperty(window, "TextDecoder", {
//         configurable: true,
//         enumerable: true,
//         get: () => TextDecoder,
//     });
// }
// if (Platform.OS !== "web") {
//     // require("react-native-polyfill-globals");
//     // @ts-ignore
//     (Symbol).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
//     // polyfill();
// }

polyfillWebCrypto();