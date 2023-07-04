import React from 'react';

function RenderPaging(props) {
    const {type, index, setCurrentIndex, currentIndex} = props
    let activeLink = index === currentIndex
    switch (type) {
        case "touched":
            return (
                <li key={index} className='page-item'>
                    <button type={"button"} onClick={() => setCurrentIndex(index)}
                            className={activeLink ? `btn btn-primary` : `btn btn-success`}>
                        {index + 1}
                    </button>
                </li>
            )
        case "untouched":
            return (
                <li key={index} className='page-item'>
                    <button type={"button"} onClick={() => setCurrentIndex(index)}
                            className={activeLink ? `btn btn-primary` : `btn btn-secondary`}>
                        {index + 1}
                    </button>
                </li>
            );
    }
}

export default RenderPaging;