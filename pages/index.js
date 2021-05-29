import { useRouter } from 'next/router';
import Layout from '../components/layout';
import Client from '../components/client';
import { gql,useQuery } from '@apollo/client';
import Header from '../components/header';
import styles from "../styles/index.module.css";
import Link from 'next/link';

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

export default function Home() {
  const router = useRouter();
  // Obtener clientes
  const { data,loading,client } = useQuery(GET_CLIENTS);
  if (loading) return "";

  if (!data) {
    client.clearStore();
    router.push('/login');
    return '';
  }
  if (!data.getClientsofSeller) {
    client.clearStore();
    router.push('/login');
    return '';
  }
  return (
    <Layout>
      <main className={styles.main}>
        <Header/>
        <h2 className={styles.mainH}>Clientes</h2>
        <Link href="/newclient">
          <a className={styles.middleH2}>Crear nuevo cliente</a>
        </Link>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th className={styles.hide}>Telefono</th>
              <th className={styles.hide}>Cumpleaños</th>
              <th className={styles.hide}>Género</th>
              <th>Eliminar</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {data.getClientsofSeller.map( client => (
              <Client key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      </main>
    </Layout>
  )
}
