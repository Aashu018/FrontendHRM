import React from 'react'

const Navbar = () => {
    return (
        <div>
            <nav class="navbar bg-primary navbar-expand-lg ">
                <div class="container-fluid">
                    <a class="navbar-brand text-white" href="#">HRMS</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    {/* <div class="collapse navbar-collapse " id="navbarSupportedContent " style={{'justifyContent':'end'}}>
                        <ul class="navbar-nav d-flex  mb-2 mb-lg-0">
                            <li class="nav-item ">
                                <a class="nav-link active text-white" aria-current="page" href="#">Leave Request</a>
                            </li>
                            
                        </ul>
                        
                    </div> */}
                </div>
            </nav>
        </div>
    )
}

export default Navbar