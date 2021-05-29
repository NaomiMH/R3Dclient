import { React,useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import styles from "../styles/signin.module.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_USER = gql`
    mutation newUser($input: UserInput){
        newUser(input:$input){
            username
        }
    }
`;

const Signin = () => {
    // Mensaje de usuario ya creado
    const [message, saveMessage] = useState(null);
    // Crear usuario
    const [ newUser ] = useMutation(NEW_USER);
    // Router
    const router = useRouter();

    // Formulario
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            password2: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Ingrese un usuario.').min(4, 'El usuario debe tener 4 caracteres minimo'),
            password: Yup.string().required('Ingrese una contraseña.').min(4, 'La contraseña debe tener 4 caracteres minimo'),
            password2: Yup.string().oneOf([Yup.ref('password'),null],'Las contraseñas deben de ser iguales.')
        }),
        onSubmit: async values => {
            const {username,password} = values;
            try{
                const {data} = await newUser({
                    variables: {
                        input: {
                            username,
                            password
                        }
                    }
                });
                // Mensaje de usuario creado
                saveMessage('Usuario creado.');
                setTimeout(()=>{
                    router.push('/login')
                }, 3000);
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
                        <p>Ya tienes cuenta?</p>
                        <input type="button" className={styles.extraBtn} value="Log in" onClick={() => router.push('/login')} />
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
                        <div className={styles.middleDiv}>
                            <label className={styles.label} htmlFor="password2">Confirmar contraseña</label>
                            <input id="password2" type="password" value={formik.values.password2}
                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        </div>
                        { formik.touched.password2 && formik.errors.password2 ? (
                            <p className={styles.error}>{formik.errors.password2}</p>
                        ) : null }
                        <input className={styles.mainBtn} type="submit" value="Sign in" />
                    </form>
                </div>
            </main>
        </Layout>
    );
}

export default Signin