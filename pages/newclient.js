import { React,useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import styles from '../styles/newclient.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_CLIENT = gql`
    mutation newClient($input: ClientInput) {
        newClient(input: $input) {
            name
            f_lastname
            m_lastname
        }
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

const NewClient = () => {
    // Mensaje de usuario ya creado
    const [message, saveMessage] = useState(null);
    // Crear usuario
    const [ newClient ] = useMutation(NEW_CLIENT, {
        update(cache, {data: {newClient} }) {
          const { getClientsofSeller } = cache.readQuery({query: GET_CLIENTS })
          cache.writeQuery({
              query: GET_CLIENTS,
              data: {
                  getClientsofSeller: [...getClientsofSeller, newClient]
              }
          });
        }
    });
    // Router
    const router = useRouter();

    // Formulario
    const formik = useFormik({
        initialValues: {
            name: '',
            f_lastname: '',
            m_lastname: '',
            gender: '',
            birthday: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Ingrese un nombre.'),
            f_lastname: Yup.string().required('Ingrese un apellido paterno.'),
            m_lastname: Yup.string().required('Ingrese un apellido materno.'),
            birthday: Yup.string().required('Ingrese un cumpleaños.'),
            gender: Yup.string().required('Seleccione un género.'),
            phone: Yup.string().required('Ingrese un telefono.')
            .matches(/^[0-9]+$/, "Ingrese solo digitos")
            .min(10, 'Ingrese un telefono de 10 digitos')
            .max(10, 'Ingrese un telefono de 10 digitos')
        }),
        onSubmit: async values => {
            const {name,f_lastname,m_lastname,gender,birthday,phone} = values;
            try{
                const { data } = await newClient({
                    variables: {
                        input: {
                            name,
                            f_lastname,
                            m_lastname,
                            gender,
                            birthday,
                            phone
                        }
                    }
                });
                // Redirigir
                router.push('/');
            } catch (error) {
                saveMessage(error.message.replace("GraphQL error: ",""));

                setTimeout(() => {
                    saveMessage(null)
                }, 3000);
            }
        }
    });

    return (
        <Layout>
            <main className={styles.main}>
                <div className={styles.mainDiv}>
                    <form className={styles.mainForm} onSubmit={formik.handleSubmit}>
                        { message && showMessage() }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="name">Nombre</label>
                            <input id="name" type="text" value={formik.values.name}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.name && formik.errors.name ? (
                            <p className={styles.error}>{formik.errors.name}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="f_lastname">Apellido Paterno</label>
                            <input id="f_lastname" type="text" value={formik.values.f_lastname}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.f_lastname && formik.errors.f_lastname ? (
                            <p className={styles.error}>{formik.errors.f_lastname}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="m_lastname">Apellido Materno</label>
                            <input id="m_lastname" type="text" value={formik.values.m_lastname}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.m_lastname && formik.errors.m_lastname ? (
                            <p className={styles.error}>{formik.errors.m_lastname}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="phone">Telefono</label>
                            <input id="phone" type="tel" value={formik.values.phone}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.phone && formik.errors.phone ? (
                            <p className={styles.error}>{formik.errors.phone}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="gender">Género</label>
                            <input name="gender" id="male" type="radio" value="Hombre"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label className={styles.label} htmlFor="gender">Hombre</label>
                            <input name="gender" id="female" type="radio" value="Mujer"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            <label className={styles.label} htmlFor="female">Mujer</label>
                        </div>
                        { formik.touched.gender && formik.errors.gender ? (
                            <p className={styles.error}>{formik.errors.gender}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="birthday">Cumpleaños</label>
                            <input id="birthday" type="date" value={formik.values.birthday}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.birthday && formik.errors.birthday ? (
                            <p className={styles.error}>{formik.errors.birthday}</p>
                        ) : null }
                        <input className={styles.mainBtn} type="submit" value="Crear cliente" />
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default NewClient;