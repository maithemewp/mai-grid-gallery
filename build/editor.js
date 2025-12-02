/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./block/grid-gallery-item/block.json":
/*!********************************************!*\
  !*** ./block/grid-gallery-item/block.json ***!
  \********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"apiVersion":3,"name":"mai/grid-gallery-item","title":"Grid Gallery Item","description":"A single media item within a grid gallery","category":"media","parent":["mai/grid-gallery"],"textdomain":"mai-grid-gallery","supports":{"html":false,"reusable":false},"usesContext":["mai/grid-gallery/maxVisible"],"attributes":{"id":{"type":"number"},"url":{"type":"string"},"type":{"type":"string","enum":["image","video"]},"alt":{"type":"string","default":""},"caption":{"type":"string","source":"html","selector":"figcaption"},"focalPoint":{"type":"object","default":{"x":0.5,"y":0.5}},"autoplay":{"type":"boolean","default":false}}}');

/***/ }),

/***/ "./block/grid-gallery-item/edit.js":
/*!*****************************************!*\
  !*** ./block/grid-gallery-item/edit.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/upload.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/caption.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * WordPress dependencies
 */






function Edit({
  attributes,
  setAttributes
}) {
  const {
    id,
    url,
    type,
    alt,
    caption,
    focalPoint,
    autoplay
  } = attributes;
  const [localFocalPoint, setLocalFocalPoint] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(focalPoint);
  const [showCaption, setShowCaption] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(!!caption);

  /**
   * Determines media type from URL extension.
   *
   * @param {string} url The media URL.
   * @return {string} 'video' or 'image'.
   */
  const getTypeFromUrl = url => {
    if (!url) {
      return 'image';
    }

    // Extract extension from URL path (before query string)
    const urlPath = url.split('?')[0].toLowerCase();
    const lastDot = urlPath.lastIndexOf('.');
    if (lastDot === -1) {
      return 'image';
    }
    const extension = urlPath.substring(lastDot);
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v'];
    return videoExtensions.includes(extension) ? 'video' : 'image';
  };

  // Get the effective type (use attribute or detect from URL)
  const effectiveType = type || (url ? getTypeFromUrl(url) : 'image');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: `wp-block-mai-grid-gallery-item--${effectiveType || 'empty'}`
  });

  // Auto-detect type from URL if type is not set or doesn't match the URL.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (url) {
      const detectedType = getTypeFromUrl(url);
      // Update if type is not set, or if it doesn't match the detected type.
      if (!type || type !== detectedType) {
        setAttributes({
          type: detectedType
        });
      }
    }
  }, [url, type, setAttributes]);
  const onSelectMedia = media => {
    if (!media || !media.url) {
      return;
    }
    const mediaType = media.type && media.type.startsWith('video/') ? 'video' : 'image';
    const mediaCaption = media.caption || '';
    setAttributes({
      id: media.id,
      url: media.url,
      type: mediaType,
      alt: media.alt || '',
      caption: mediaCaption
    });

    // Show caption if media has one
    if (mediaCaption) {
      setShowCaption(true);
    }
  };
  const handleFocalPointChange = newFocalPoint => {
    setLocalFocalPoint(newFocalPoint);
    setAttributes({
      focalPoint: newFocalPoint
    });
  };
  const toggleCaption = () => {
    setShowCaption(!showCaption);
    // If hiding caption, clear it
    if (showCaption) {
      setAttributes({
        caption: ''
      });
    }
  };

  // If no media selected yet
  if (!url) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("figure", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Grid Gallery Item', 'mai-grid-gallery'),
        instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select an image or video', 'mai-grid-gallery'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaReplaceFlow, {
          allowedTypes: ['image', 'video'],
          accept: "image/*,video/*",
          onSelect: onSelectMedia,
          name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Media', 'mai-grid-gallery')
        })
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.BlockControls, {
      group: "other",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.MediaReplaceFlow, {
          allowedTypes: ['image', 'video'],
          accept: "image/*,video/*",
          onSelect: onSelectMedia,
          name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replace', 'mai-grid-gallery'),
          mediaId: id
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_6__["default"],
          label: showCaption ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Remove caption', 'mai-grid-gallery') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add caption', 'mai-grid-gallery'),
          onClick: toggleCaption,
          isPressed: showCaption
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InspectorControls, {
      children: ['image' === effectiveType && url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        style: {
          padding: '0 16px 16px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.FocalPointPicker, {
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Focal Point', 'mai-grid-gallery'),
          url: url,
          value: localFocalPoint,
          onDragStart: handleFocalPointChange,
          onDrag: handleFocalPointChange,
          onChange: handleFocalPointChange
        })
      }), 'video' === effectiveType && url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Video Settings', 'mai-grid-gallery'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Autoplay', 'mai-grid-gallery'),
          checked: autoplay || false,
          onChange: value => setAttributes({
            autoplay: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Video will always be muted and loop when autoplay is enabled.', 'mai-grid-gallery')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("figure", {
      ...blockProps,
      children: ['image' === effectiveType ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
        src: url,
        alt: alt,
        style: {
          objectPosition: `${localFocalPoint.x * 100}% ${localFocalPoint.y * 100}%`
        }
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("video", {
        src: url,
        ...(autoplay ? {
          autoPlay: true
        } : {}),
        playsInline: true,
        muted: true,
        loop: true
      }), showCaption && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.RichText, {
        tagName: "figcaption",
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add caption…', 'mai-grid-gallery'),
        value: caption,
        onChange: value => setAttributes({
          caption: value
        }),
        inlineToolbar: true
      })]
    })]
  });
}

/***/ }),

/***/ "./block/grid-gallery-item/index.js":
/*!******************************************!*\
  !*** ./block/grid-gallery-item/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/upload.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./block/grid-gallery-item/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./block/grid-gallery-item/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./block/grid-gallery-item/save.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_1__,
  icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./block/grid-gallery-item/save.js":
/*!*****************************************!*\
  !*** ./block/grid-gallery-item/save.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/**
 * WordPress dependencies
 */
function save() {
  // This is a dynamic block with a PHP render callback.
  // Return null so WordPress uses the render callback.
  return null;
}

/***/ }),

/***/ "./block/grid-gallery/block.json":
/*!***************************************!*\
  !*** ./block/grid-gallery/block.json ***!
  \***************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"apiVersion":3,"name":"mai/grid-gallery","title":"Mai Grid Gallery","description":"A responsive, stylish, and lightweight grid gallery with lightbox support","category":"media","keywords":["gallery","grid","images","video","lightbox"],"textdomain":"mai-grid-gallery","supports":{"align":["wide","full"],"html":false,"dimensions":{"aspectRatio":true}},"providesContext":{"mai/grid-gallery/maxVisible":"maxVisible"},"attributes":{"maxVisible":{"type":"number","default":0}},"editorScript":"file:../../build/editor.js","editorStyle":"file:../../build/editor-styles.css"}');

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/caption.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/caption.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const caption = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M6 5.5h12a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5ZM4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm4 10h2v-1.5H8V16Zm5 0h-2v-1.5h2V16Zm1 0h2v-1.5h-2V16Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (caption);
//# sourceMappingURL=caption.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/gallery.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/gallery.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   gallery: () => (/* binding */ gallery)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const gallery = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M16.375 4.5H4.625a.125.125 0 0 0-.125.125v8.254l2.859-1.54a.75.75 0 0 1 .68-.016l2.384 1.142 2.89-2.074a.75.75 0 0 1 .874 0l2.313 1.66V4.625a.125.125 0 0 0-.125-.125Zm.125 9.398-2.75-1.975-2.813 2.02a.75.75 0 0 1-.76.067l-2.444-1.17L4.5 14.583v1.792c0 .069.056.125.125.125h11.75a.125.125 0 0 0 .125-.125v-2.477ZM4.625 3C3.728 3 3 3.728 3 4.625v11.75C3 17.273 3.728 18 4.625 18h11.75c.898 0 1.625-.727 1.625-1.625V4.625C18 3.728 17.273 3 16.375 3H4.625ZM20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z",
  fillRule: "evenodd",
  clipRule: "evenodd"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gallery);
//# sourceMappingURL=gallery.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/seen.js":
/*!********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/seen.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const seen = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M3.99961 13C4.67043 13.3354 4.6703 13.3357 4.67017 13.3359L4.67298 13.3305C4.67621 13.3242 4.68184 13.3135 4.68988 13.2985C4.70595 13.2686 4.7316 13.2218 4.76695 13.1608C4.8377 13.0385 4.94692 12.8592 5.09541 12.6419C5.39312 12.2062 5.84436 11.624 6.45435 11.0431C7.67308 9.88241 9.49719 8.75 11.9996 8.75C14.502 8.75 16.3261 9.88241 17.5449 11.0431C18.1549 11.624 18.6061 12.2062 18.9038 12.6419C19.0523 12.8592 19.1615 13.0385 19.2323 13.1608C19.2676 13.2218 19.2933 13.2686 19.3093 13.2985C19.3174 13.3135 19.323 13.3242 19.3262 13.3305L19.3291 13.3359C19.3289 13.3357 19.3288 13.3354 19.9996 13C20.6704 12.6646 20.6703 12.6643 20.6701 12.664L20.6697 12.6632L20.6688 12.6614L20.6662 12.6563L20.6583 12.6408C20.6517 12.6282 20.6427 12.6108 20.631 12.5892C20.6078 12.5459 20.5744 12.4852 20.5306 12.4096C20.4432 12.2584 20.3141 12.0471 20.1423 11.7956C19.7994 11.2938 19.2819 10.626 18.5794 9.9569C17.1731 8.61759 14.9972 7.25 11.9996 7.25C9.00203 7.25 6.82614 8.61759 5.41987 9.9569C4.71736 10.626 4.19984 11.2938 3.85694 11.7956C3.68511 12.0471 3.55605 12.2584 3.4686 12.4096C3.42484 12.4852 3.39142 12.5459 3.36818 12.5892C3.35656 12.6108 3.34748 12.6282 3.34092 12.6408L3.33297 12.6563L3.33041 12.6614L3.32948 12.6632L3.32911 12.664C3.32894 12.6643 3.32879 12.6646 3.99961 13ZM11.9996 16C13.9326 16 15.4996 14.433 15.4996 12.5C15.4996 10.567 13.9326 9 11.9996 9C10.0666 9 8.49961 10.567 8.49961 12.5C8.49961 14.433 10.0666 16 11.9996 16Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (seen);
//# sourceMappingURL=seen.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/unseen.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/unseen.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const unseen = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M4.67 10.664s-2.09 1.11-2.917 1.582l.494.87 1.608-.914.002.002c.343.502.86 1.17 1.563 1.84.348.33.742.663 1.185.976L5.57 16.744l.858.515 1.02-1.701a9.1 9.1 0 0 0 4.051 1.18V19h1v-2.263a9.1 9.1 0 0 0 4.05-1.18l1.021 1.7.858-.514-1.034-1.723c.442-.313.837-.646 1.184-.977.703-.669 1.22-1.337 1.563-1.839l.002-.003 1.61.914.493-.87c-1.75-.994-2.918-1.58-2.918-1.58l-.003.005a8.29 8.29 0 0 1-.422.689 10.097 10.097 0 0 1-1.36 1.598c-1.218 1.16-3.042 2.293-5.544 2.293-2.503 0-4.327-1.132-5.546-2.293a10.099 10.099 0 0 1-1.359-1.599 8.267 8.267 0 0 1-.422-.689l-.003-.005Z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unseen);
//# sourceMappingURL=unseen.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/upload.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/upload.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const upload = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M18.5 15v3.5H13V6.7l4.5 4.1 1-1.1-6.2-5.8-5.8 5.8 1 1.1 4-4v11.7h-6V15H4v5h16v-5z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (upload);
//# sourceMappingURL=upload.js.map

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/editor.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/gallery.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/seen.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/unseen.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _block_grid_gallery_block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../block/grid-gallery/block.json */ "./block/grid-gallery/block.json");
/* harmony import */ var _block_grid_gallery_item_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../block/grid-gallery-item/index.js */ "./block/grid-gallery-item/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * WordPress dependencies.
 * These are the core WordPress packages needed for block development.
 */









/**
 * Internal dependencies.
 * Import the block metadata and register the gallery item block.
 */



/**
 * Add gallery icon to metadata.
 * This sets the icon that appears in the block inserter.
 */

_block_grid_gallery_block_json__WEBPACK_IMPORTED_MODULE_7__.icon = _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__["default"];

/**
 * Register the Grid Gallery block.
 * This is the main gallery container block that holds gallery item blocks.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('mai/grid-gallery', {
  ..._block_grid_gallery_block_json__WEBPACK_IMPORTED_MODULE_7__,
  /**
   * Edit component for the grid gallery block.
   * This function renders the block in the editor.
   *
   * @param {Object} props - The component props.
   * @param {string} props.clientId - The unique ID of this block instance.
   * @param {Object} props.attributes - The block's saved attributes.
   * @param {Function} props.setAttributes - Function to update block attributes.
   * @return {JSX.Element} The rendered edit component.
   */
  edit: ({
    clientId,
    attributes,
    setAttributes
  }) => {
    /**
     * Editor-only state for showing/hiding extra images.
     * This state is only used in the editor and doesn't affect the saved content.
     */
    const [editorShowAll, setEditorShowAll] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);

    /**
     * Get the inner blocks (gallery items) and count from the block editor store.
     * useSelect is a React hook that subscribes to WordPress data store changes.
     */
    const {
      innerBlocks,
      blockCount
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
      const {
        getBlock
      } = select('core/block-editor');
      const block = getBlock(clientId);
      return {
        innerBlocks: block?.innerBlocks || [],
        blockCount: block?.innerBlocks?.length || 0
      };
    }, [clientId]);

    /**
     * Get functions to insert and replace inner blocks.
     * useDispatch provides functions to modify the block editor state.
     */
    const {
      insertBlocks,
      replaceInnerBlocks
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)('core/block-editor');

    /**
     * Calculate gallery state variables.
     * These determine what UI elements to show and how many items are visible.
     */
    const hasInnerBlocks = blockCount > 0;
    const visibleImages = attributes.maxVisible ? attributes.maxVisible : Math.min(blockCount, 8);
    const hasHiddenImages = blockCount > visibleImages;

    /**
     * Get block props with data attributes for styling and JavaScript.
     * useBlockProps provides the standard block wrapper attributes.
     */
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      'data-count': blockCount,
      'data-visible': visibleImages
    });

    /**
     * Extract media IDs from all inner blocks that have an ID.
     * This is used for the MediaReplaceFlow component.
     */
    const mediaIds = innerBlocks.filter(block => block.attributes?.id).map(block => block.attributes.id);
    const hasMediaIds = mediaIds.length > 0;

    /**
     * Handle media selection from the media library or file upload.
     * This function processes selected media and creates gallery item blocks.
     *
     * @param {Array|FileList} media - The selected media items or file list.
     * @return {void}
     */
    const handleMediaSelect = media => {
      // Bail early if no media was selected.
      if (!media || media.length === 0) {
        return;
      }

      /**
       * Check if this is a new file upload (FileList) or existing media from library.
       * FileList objects need to be converted to an array.
       */
      const newFileUploads = Object.prototype.toString.call(media) === '[object FileList]';
      const mediaArray = newFileUploads ? Array.from(media) : media;

      /**
       * Create gallery item blocks for each selected media item.
       * Determine if each item is a video or image based on its MIME type.
       */
      const blocksToInsert = mediaArray.map(item => {
        const mediaType = item.type && item.type.startsWith('video/') ? 'video' : 'image';
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery-item', {
          id: item.id,
          url: item.url,
          type: mediaType
        });
      });

      /**
       * Insert or replace blocks based on whether gallery already has items.
       * If gallery has items and we're not uploading new files, add to existing.
       * Otherwise, replace all blocks (new gallery or file upload).
       */
      if (blocksToInsert.length > 0) {
        if (hasMediaIds && !newFileUploads) {
          // Add to existing gallery (when addToGallery is true).
          insertBlocks(blocksToInsert, innerBlocks.length, clientId);
        } else {
          // Replace all blocks.
          replaceInnerBlocks(clientId, blocksToInsert);
        }
      }
    };

    /**
     * Get props for the inner blocks container.
     * This configures which blocks are allowed as children and their behavior.
     */
    const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)(blockProps, {
      allowedBlocks: ['mai/grid-gallery-item'],
      templateLock: false,
      orientation: 'horizontal'
    });

    /**
     * Render the block editor UI.
     * Returns JSX that displays the gallery in the editor with controls.
     */
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [hasInnerBlocks && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockControls, {
        group: "other",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaReplaceFlow, {
            allowedTypes: ['image', 'video'],
            accept: "image/*,video/*",
            handleUpload: false,
            onSelect: handleMediaSelect,
            name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Manage Media', 'mai-grid-gallery'),
            multiple: true,
            mediaIds: mediaIds,
            addToGallery: hasMediaIds
          })
        }), hasHiddenImages && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarGroup, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToolbarButton, {
            icon: editorShowAll ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_11__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_12__["default"],
            text: editorShowAll ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Hide extra', 'mai-grid-gallery') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Show hidden', 'mai-grid-gallery'),
            onClick: () => setEditorShowAll(!editorShowAll),
            isPressed: editorShowAll
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Settings', 'mai-grid-gallery'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Max Visible Items', 'mai-grid-gallery'),
            value: attributes.maxVisible || 0,
            onChange: value => setAttributes({
              maxVisible: value || 0
            }),
            min: 0,
            max: 8,
            step: 1,
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Limit visible items to this number. Use 0 to use the number of images in the gallery (max 8 visible).', 'mai-grid-gallery')
          })
        })
      }), !hasInnerBlocks ?
      /*#__PURE__*/
      // Empty gallery placeholder - shown when no media has been added yet.
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_5__.View, {
        ...innerBlocksProps,
        children: [innerBlocksProps.children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaPlaceholder, {
          handleUpload: false,
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_10__["default"],
          labels: {
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Mai Grid Gallery', 'mai-grid-gallery'),
            instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Drag and drop images, upload, or choose from your library.', 'mai-grid-gallery')
          },
          onSelect: handleMediaSelect,
          accept: "image/*,video/*",
          allowedTypes: ['image', 'video'],
          multiple: true,
          value: {}
        })]
      }) :
      /*#__PURE__*/
      // Gallery with items - shows all gallery items, with optional data attribute to hide extras in editor.
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        ...innerBlocksProps,
        ...(hasHiddenImages && !editorShowAll ? {
          'data-hide-extra': 'true'
        } : {})
      })]
    });
  },
  /**
   * Save component for the grid gallery block.
   * This function defines what gets saved to the database.
   * Since this is a dynamic block, we return the inner blocks content.
   *
   * @param {Object} props - The component props.
   * @param {Object} props.attributes - The block's saved attributes.
   * @return {JSX.Element} The saved block markup.
   */
  save: ({
    attributes
  }) => {
    /**
     * Get block props for the saved output.
     * useBlockProps.save() provides the wrapper attributes for saved content.
     */
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save();

    /**
     * Return the saved block structure.
     * InnerBlocks.Content renders all the child gallery item blocks.
     */
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks.Content, {})
    });
  },
  /**
   * Block transforms configuration.
   * Transforms allow converting one block type to another.
   * This enables users to convert WordPress core galleries to Mai Grid Galleries.
   */
  transforms: {
    from: [{
      type: 'block',
      blocks: ['core/gallery'],
      /**
       * Transform function to convert core/gallery blocks to mai/grid-gallery.
       * Handles both newer format (with inner blocks) and older format (with ids attribute).
       *
       * @param {Object} attributes - The core/gallery block attributes.
       * @param {Array} innerBlocks - The inner blocks of the core/gallery (wp:image blocks).
       * @return {Object} A new mai/grid-gallery block with transformed inner blocks.
       */
      transform: (attributes, innerBlocks) => {
        /**
         * Handle newer gallery format with inner blocks (wp:image blocks).
         * Modern WordPress galleries use nested image blocks instead of just IDs.
         */
        if (innerBlocks && innerBlocks.length > 0) {
          /**
           * Get the WordPress core data store selector.
           * This allows us to fetch media attachment data.
           */
          const coreSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.select)('core');
          /**
           * Transform each inner image block into a gallery item block.
           * Map through all inner blocks and extract image data.
           */
          const transformedBlocks = innerBlocks.map(block => {
            /**
             * Extract image data from core/image block attributes.
             * Get the attributes object, defaulting to empty object if missing.
             */
            const imageAttrs = block.attributes || {};
            const imageId = imageAttrs.id;

            // Skip blocks without an image ID.
            if (!imageId) {
              return null;
            }

            /**
             * Get media data from the WordPress core store.
             * This contains full attachment information like URLs, alt text, captions.
             */
            const media = coreSelect.getMedia(imageId);
            if (!media) {
              /**
               * Fallback: use attributes from the image block if media not in store.
               * This handles cases where the media data hasn't been loaded yet.
               */
              return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery-item', {
                id: imageId,
                url: imageAttrs.url || '',
                type: 'image',
                alt: imageAttrs.alt || '',
                caption: imageAttrs.caption || ''
              });
            }

            /**
             * Get the full size image URL.
             * Try multiple possible URL locations in the media object.
             */
            const url = media.source_url || media.media_details?.sizes?.full?.source_url || media.url || '';

            /**
             * Get caption - handle both object and string formats.
             * WordPress media captions can be stored as objects with a 'raw' property or as plain strings.
             */
            let caption = '';
            if (media.caption) {
              caption = typeof media.caption === 'string' ? media.caption : media.caption.raw || '';
            }

            /**
             * Create a new gallery item block with the media data.
             * This becomes a child block of the mai/grid-gallery block.
             */
            return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery-item', {
              id: media.id,
              url: url,
              type: 'image',
              alt: media.alt_text || '',
              caption: caption
            });
          }).filter(Boolean); // Remove any null entries.

          /**
           * Return empty gallery if no valid images were found.
           * This prevents creating a gallery block with no content.
           */
          if (transformedBlocks.length === 0) {
            return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery', {});
          }

          /**
           * Create the grid gallery block with all transformed inner blocks.
           * The third parameter is an array of inner blocks (gallery items).
           */
          return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery', {}, transformedBlocks);
        }

        /**
         * Fallback: Handle older gallery format with ids attribute.
         * Older WordPress galleries stored just an array of attachment IDs.
         */
        const {
          ids
        } = attributes;

        /**
         * Return empty gallery if no image IDs found.
         * This handles empty or invalid gallery blocks.
         */
        if (!ids || ids.length === 0) {
          return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery', {});
        }

        /**
         * Get media data for each image ID.
         * Fetch full attachment data from the WordPress core store.
         */
        const coreSelect = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.select)('core');
        const transformedBlocks = ids.map(id => {
          /**
           * Get media attachment data for this ID.
           * Returns null if the media doesn't exist or isn't loaded.
           */
          const media = coreSelect.getMedia(id);
          if (!media) {
            return null;
          }

          /**
           * Get the full size image URL.
           * Try multiple possible URL locations in the media object.
           */
          const url = media.source_url || media.media_details?.sizes?.full?.source_url || media.url || '';

          /**
           * Get caption - handle both object and string formats.
           * WordPress media captions can be stored as objects with a 'raw' property or as plain strings.
           */
          let caption = '';
          if (media.caption) {
            caption = typeof media.caption === 'string' ? media.caption : media.caption.raw || '';
          }

          /**
           * Create a new gallery item block with the media data.
           * This becomes a child block of the mai/grid-gallery block.
           */
          return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery-item', {
            id: media.id,
            url: url,
            type: 'image',
            alt: media.alt_text || '',
            caption: caption
          });
        }).filter(Boolean); // Remove any null entries.

        /**
         * Create the grid gallery block with all transformed inner blocks.
         * The third parameter is an array of inner blocks (gallery items).
         */
        return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('mai/grid-gallery', {}, transformedBlocks);
      }
    }]
  }
});
})();

/******/ })()
;
//# sourceMappingURL=editor.js.map