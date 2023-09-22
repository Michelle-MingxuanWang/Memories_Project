import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Input from './Input';
import Icon from './Icon';
import useStyles from './styles';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};
export const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isSignup){
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const googleSuccess = async(res) => {
        const token = res?.credential;
        const result = jwt_decode(token);
        try {
            dispatch({ type: AUTH, data: { result, token } });
            history.push('/');
        } catch (error) {
            console.log(error);
        }

    };
    const googleFailure = (error) => {
        alert("Google Sign was unsuccessful. Try again later");
    };


    return (
        <GoogleOAuthProvider clientId='239248557394-38kicr0qha20ghft0ldkq5fo5606pb44.apps.googleusercontent.com'>
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                            <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                            )}
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In' }
                    </Button>
                    <GoogleLogin 
                        clientId='239248557394-38kicr0qha20ghft0ldkq5fo5606pb44.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy='single_host_origin'
                    />
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
        </GoogleOAuthProvider>
    )
    
}

export default Auth;