//@ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import { FlipBook, BookProvider } from "book-viewer";
import "book-viewer/dist/style.css";

const App = () => {
  const [imgs, setImgs] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const getImgs = async () => {
      const getBookLink = (page) => {
        return `https://api.akarabook.com/api/other/resource/BOK0000000362/${page}.png?token=`;
      };

      const getLoremLink = (page) => {
        return `https://picsum.photos/id/${page}/800/800`;
      };

      const imgUrls = Array(30)
        .fill(0)
        .map((_item: any, index) => {
          return getBookLink(index + 1);
        });

      setImgs(imgUrls);
    };

    getImgs();
  }, []);

  const ref = useRef<any>();

  return (
    <>
      <button
        onClick={() => {
          setShow(true);
        }}
      >
        open
      </button>

      <BookProvider>
        <div
          style={{
            position: `absolute`,
            top: 0,
            left: 0,
            opacity: show ? 1 : 0,
            zIndex: show ? 1 : -1,
          }}
        >
          <FlipBook
            containerRef={ref}
            id={"view"}
            src={imgs}
            prefixControl={
              <div
                style={{
                  width: "100%",
                }}
                onClick={() => {
                  setShow(false);
                }}
              >
                exit
              </div>
            }
            viewTypeTogglerLabels={["one", "two"]}
            suffixControl={
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>1</div>
                <div>hello</div>
              </div>
            }
          />
        </div>
      </BookProvider>
    </>
  );
};

export default App;
