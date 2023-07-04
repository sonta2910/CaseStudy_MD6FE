import React from 'react';
import {Link} from "react-router-dom";

const Pagination = ({elementPerPage, totalElements, paginate, currentPage}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalElements / elementPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav style={{display:"flex", justifyContent:"center"}}>
            <ul className='pagination'>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {currentPage === 1 ||
                            <li className="page-item">
                                <Link className="page-link" to="#" aria-label="Previous"
                                      onClick={() => paginate(currentPage - 1)}>
                                    &laquo;
                                </Link>
                            </li>
                        }
                        {
                            pageNumbers.map(number => (
                                <li key={number} className='page-item'>
                                    <button type={"button"} onClick={() => paginate(number)} className='page-link'>
                                        {number}
                                    </button>
                                </li>
                            ))
                        }
                        {currentPage === pageNumbers.length ||
                            <li className="page-item">
                                <Link className="page-link" to="#" aria-label="Next"
                                      onClick={() => paginate(currentPage + 1)}>
                                    &raquo;
                                </Link>
                            </li>
                        }
                    </ul>
                </nav>

            </ul>
        </nav>
    );
};

export default Pagination;