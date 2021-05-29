import React from 'react';
import Swal from 'sweetalert2';
import styles from '../styles/client.module.css';
import { gql,useMutation } from '@apollo/client';
import Router from 'next/router';

const DEL_CLIENT = gql`
    mutation delClient($id:ID!) {
        delClient(id:$id)
    }
`;

const GET_CLIENTS = gql`
  query getClientsofSeller {
    getClientsofSeller {
      name
      f_lastname
      m_lastname
      birthday
      gender
      phone
    }
  }
`;

const Client = ( {client} ) => {
    const { id,name,f_lastname,m_lastname,phone,birthday,gender } = client;
    const [ delClient ] = useMutation(DEL_CLIENT, {
        update(cache) {
          const { getClientsofSeller } = cache.readQuery({query: GET_CLIENTS });
          cache.writeQuery({
              query: GET_CLIENTS,
              data: {
                  getClientsofSeller: getClientsofSeller.filter( tempclient => tempclient.id !== id )
              }
          });
        }
    });

    const deleteClient = () => {
        Swal.fire({
            title: 'Desea eliminar el cliente?',
            text: "No podras recuperar al cliente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo',
            cancelButtonText: 'No, cancelar'
          }).then( async (result) => {
            if (result.isConfirmed) {
                try{
                    console.log('try del')
                    const { data } = await delClient({
                        variables: {
                            id
                        }
                    });
                    console.log('despues')
                    console.log(data)

                    Swal.fire(
                      'Borrado',
                      'El cliente ha sido eliminado.',
                      'success'
                    )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editClient = () => {
        Router.push({
            pathname: "/editclient/[id]",
            query: {
                id
            }
        })
    }

    return (
        <tr>
            <td>{name}</td>
            <td>{f_lastname}</td>
            <td>{m_lastname}</td>
            <td className={styles.hide}>{phone}</td>
            <td className={styles.hide}>{birthday}</td>
            <td className={styles.hide}>{gender}</td>
            <td className={styles.mainTD}>
                <button type="button" className={styles.mainBtn} onClick={() => deleteClient()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.mainDelImg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className={styles.mainTD}>
                <button type="button" className={styles.mainBtn} onClick={() => editClient()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.mainEdiImg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            </td>
        </tr>
    )
};

export default Client;