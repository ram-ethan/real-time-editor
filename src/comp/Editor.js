// import React, { useEffect, useRef } from 'react';
// import CodeMirror from 'codemirror';
// import 'codemirror/lib/codemirror.css'; // Import the CSS

// const Editor = () => {
//     const textareaRef = useRef(null);

//     useEffect(() => {
//         if (textareaRef.current) {
//             CodeMirror.fromTextArea(textareaRef.current, {
//                 // Options
//                 lineNumbers: true,
//                 mode: { name: 'javascript', json: true },

//                 // Example mode
//                 // Add any other options you need
//             });
//         }
//     }, []);

//     return <textarea ref={textareaRef} />;
// };


// export default Editor;

import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/dracula.css'
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../pages/Actions';

export default function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        console.log("basdasds");
        async function init() {

            const editor = CodeMirror.fromTextArea(document.getElementById("realTimeArea"), {
                mode: { name: 'javascript', json: true },
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                theme: "dracula"
            });
            editorRef.current = editor;

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue')
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    });
                console.log(code)
            })




        }


        init();
    }, []);
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code != null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current])
    return (
        <div className='ss'>
            <textarea name="" id="realTimeArea" cols="30" rows="10">{console.log("basdasds")}</textarea>
        </div>
    );
}

