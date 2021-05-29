import React from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/header.module.css";
import { useQuery,gql } from '@apollo/client';

const GET_USER = gql`
query getUser{
    getUser{
      username
    }
  }
`;

const Header = () => {
    const { data,loading,client } = useQuery(GET_USER);
    // Router
    const router = useRouter();
    
    if (loading) return '';

    if (!data.getUser) {
        client.clearStore();
        router.push('/login');
        return '';
    }

    const { username } = data.getUser;
    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
    return (
        <input type="button" className={styles.mainBtn} value="Log out" onClick={() => logout()} />
    );
}

export default Header