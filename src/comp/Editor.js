import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript'; // Importing JavaScript mode
import 'codemirror/theme/dracula.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets'; // Importing close brackets addon
import 'codemirror/addon/edit/closetag'; // Importing close tag addon
import ACTIONS from '../pages/Actions';

export default function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            const editor = CodeMirror.fromTextArea(document.getElementById("realTimeArea"), {
                mode: 'javascript', // Setting mode directly
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                theme: 'dracula'
            });
            editorRef.current = editor;

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    });
                }
            });
        }

        init();
    }, []); // Empty dependency array ensures this useEffect runs only once after initial render

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]); // Dependency array to watch for changes in socketRef.current

    return (
        <div className='ss'>
            <textarea id="realTimeArea" cols="30" rows="10"></textarea>
        </div>
    );
}
