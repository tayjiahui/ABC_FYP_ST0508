// this is the index page

import styles from '../styles/indexpage.module.css';

export default function Index() {
    return (
        <div class="d-flex align-items-center justify-content-center">
            <div class="pt-5">
                <div class="card card-block w-100 border-0">
                    <div className={styles.box}>
                        <h1 className='PageHeader'>ABC Cooking Studios</h1>
                        <h2>Purchase Ordering System</h2>
                        <div class="p-3">
                            <a href="/Login">
                                <button type="button" class="btn btn-secondary">Login</button>
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
    );
};