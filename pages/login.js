import { React,useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import styles from "../styles/login.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const CHECK_USER = gql`
    mutation checkUser($input: UserInput){
        checkUser(input:$input){
            token
        }
    }
`;

const Login = () => {
    // Mensaje de usuario ya creado
    const [message, saveMessage] = useState(null);
    // Crear usuario
    const [ checkUser ] = useMutation(CHECK_USER);
    // Router
    const router = useRouter();

    // Formulario
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Ingrese un usuario.'),
            password: Yup.string().required('Ingrese una contraseña.')
        }),
        onSubmit: async values => {
            const {username,password} = values;
            try{
                const {data} = await checkUser({
                    variables: {
                        input: {
                            username,
                            password
                        }
                    }
                });
                // Guardar el token
                const { token } = data.checkUser;
                localStorage.setItem('token',token);
                // Redirigir
                router.push('/')
            } catch (error) {
                saveMessage(error.message.replace("GraphQL error: ",""));

                setTimeout(() => {
                    saveMessage(null)
                }, 3000);
            }
        }
    });

    const showMessage = () => {
        return(
            <p>{message}</p>
        )
    }

    return (
        <Layout>
            <main className={styles.main}>
                <div className={styles.mainDiv}>
                    <div className={styles.extraDiv}>
                        <p>No tienes cuenta?</p>
                        <input type="button" className={styles.extraBtn} value="Sign in" onClick={() => router.push('/signin')} />
                    </div>
                    <form className={styles.mainForm} onSubmit={formik.handleSubmit}>
                        { message && showMessage() }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="username">Usuario</label>
                            <input id="username" type="text" value={formik.values.username}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.username && formik.errors.username ? (
                            <p className={styles.error}>{formik.errors.username}</p>
                        ) : null }
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="password">Contraseña</label>
                            <input id="password" type="password" value={formik.values.password}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.password && formik.errors.password ? (
                            <p className={styles.error}>{formik.errors.password}</p>
                        ) : null }
                        <input className={styles.mainBtn} type="submit" value="Log in" />
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default Login