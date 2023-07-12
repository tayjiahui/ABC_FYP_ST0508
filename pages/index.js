// this is the index page

import styles from '../styles/indexpage.module.css';

export default function Index() {
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="pt-5">
                <div className="card card-block w-100 border-0">
                    <div className={styles.box}>
                        <h1 className='PageHeader'>ABC Cooking Studios</h1>
                        <h2>Purchase Ordering System</h2>
                        <div className="p-3">
                            <a href="/Login">
                                <button type="button" className="btn btn-secondary">Login</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};