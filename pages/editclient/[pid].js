import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/editclient.module.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql, useQuery } from '@apollo/client';

const GET_CLIENT = gql`
  query getClient {
    getClient {
      name
      f_lastname
      m_lastname
      birthday
      gender
      phone
    }
  }
`;

const SET_CLIENT = gql`
  mutation setClient($id: ID!, $input: ClientInput) {
    setClient(id:$id, input:$input){
        id
        name
        f_lastname
        m_lastname
        birthday
        gender
        phone
    }
  }
`;

const EditClient = () => {
    const router = useRouter();
    const { query: {id} } = router;

    // Obtener usuario
    const { data,loading,error } = useQuery(GET_CLIENT,{
        variables: {
            id
        }
    })

    // Guardar cambios
    const [ setClient ] = useMutation(SET_CLIENT);

    // Schema
    const schemaVal = Yup.object({
        name: Yup.string().required('Ingrese un nombre.'),
        f_lastname: Yup.string().required('Ingrese un apellido paterno.'),
        m_lastname: Yup.string().required('Ingrese un apellido materno.'),
        birthday: Yup.string().required('Ingrese un cumpleaños.'),
        gender: Yup.string().required('Seleccione un género.'),
        phone: Yup.string().required('Ingrese un telefono.')
        .matches(/^[0-9]+$/, "Ingrese solo digitos")
        .min(10, 'Ingrese un telefono de 10 digitos')
        .max(10, 'Ingrese un telefono de 10 digitos')
    });

    if (loading) return ''

    const {getClient} = data;

    const setnewClient = async valores => {
        const {name,f_lastname,m_lastname,birthday,gender,phone} = valores;
        try {
            const {data} = await setClient({
                variables: {
                    id,
                    input: {
                        name,
                        f_lastname,
                        m_lastname,
                        birthday,
                        gender,
                        phone
                    }
                }
            });
            // Redirigir
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <main className={styles.main}>
                <div className={styles.mainDiv}>
                    <Formik
                        validationSchema={schemaVal}
                        enableReinitialize
                        initialValues={ getClient }
                        onSubmit={ ( valores ) => {
                            setnewClient(valores)
                        }}
                    >
                        {props => {
                            return (
                            <form className={styles.mainForm} onSubmit={props.handleSubmit}>
                                { message && showMessage() }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="name">Nombre</label>
                                    <input id="name" type="text" value={props.values.name}
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                </div>
                                { props.touched.name && props.errors.name ? (
                                    <p className={styles.error}>{props.errors.name}</p>
                                ) : null }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="f_lastname">Apellido Paterno</label>
                                    <input id="f_lastname" type="text" value={props.values.f_lastname}
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                </div>
                                { props.touched.f_lastname && props.errors.f_lastname ? (
                                    <p className={styles.error}>{props.errors.f_lastname}</p>
                                ) : null }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="m_lastname">Apellido Materno</label>
                                    <input id="m_lastname" type="text" value={props.values.m_lastname}
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                </div>
                                { props.touched.m_lastname && props.errors.m_lastname ? (
                                    <p className={styles.error}>{props.errors.m_lastname}</p>
                                ) : null }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="phone">Telefono</label>
                                    <input id="phone" type="tel" value={props.values.phone}
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                </div>
                                { props.touched.phone && props.errors.phone ? (
                                    <p className={styles.error}>{props.errors.phone}</p>
                                ) : null }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="gender">Género</label>
                                    <input name="gender" id="male" type="radio" value="Hombre"
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                    <label className={styles.label} htmlFor="gender">Hombre</label>
                                    <input name="gender" id="female" type="radio" value="Mujer"
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                    <label className={styles.label} htmlFor="female">Mujer</label>
                                </div>
                                { props.touched.gender && props.errors.gender ? (
                                    <p className={styles.error}>{props.errors.gender}</p>
                                ) : null }
                                <div className={styles.middleDiv}>
                                    <label className={styles.label} htmlFor="birthday">Cumpleaños</label>
                                    <input id="birthday" type="date" value={props.values.birthday}
                                    onChange={props.handleChange} onBlur={props.handleBlur} />
                                </div>
                                { props.touched.birthday && props.errors.birthday ? (
                                    <p className={styles.error}>{props.errors.birthday}</p>
                                ) : null }
                                <input className={styles.mainBtn} type="submit" value="Guardar cambios" />
                            </form>
                            )
                        }}
                    </Formik>
                </div>
            </main>
        </Layout>
    );
}

export default EditClient;