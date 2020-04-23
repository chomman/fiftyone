import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

import { Button } from 'semantic-ui-react';

const ButtonExampleButton = () => <Button>SEMANTIC UI BUTTON</Button>;

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Link to={routes.COUNTER}>to Counter</Link>
      <ButtonExampleButton />
    </div>
  );
}
