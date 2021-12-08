import React, {useState, useCallback} from 'react';

import {
    Layout,
    Page,
    Card,
    Button,
    Form,
    FormLayout,
    TextField,
} from '@shopify/polaris';

import * as yup from 'yup';

import './App.css'
import axios from "axios";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export function App() {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [_errors, _SetErrorerrors] = useState('');

    const handleFirstChange = useCallback((value) => setFirst(value), []);
    const handleLastChange = useCallback((value) => setLast(value), []);
    const handleEmailChange = useCallback((value) => setEmail(value), []);
    const handleAddressChange = useCallback((value) => setAddress(value), []);


    const validations = yup.object().shape({
        first: yup.string('first').required('First name is required'),
        last: yup.string('last').required('Last name is required'),
        email: yup.string('email').email('Email must be a valid email').required('Email is required'),
        address: yup.string('address').required('Address is required')
    });

    const handleSubmit = useCallback((_event) => {

        let {
            first,
            last,
            email,
            address
        } = _event.target.elements

        setDisabledSubmit(true)

        validateSendFields({
            first: first.value,
            last: last.value,
            email: email.value,
            address: address.value
        })

    }, []);


    const handleSuccessModal = useCallback(() => {
        setShowSuccessModal(false)
        document.getElementById('usersList').click()
    })


    function validateSendFields(fields) {

        _SetErrorerrors({})

        validations.validate(fields).then((res) => {

            if (res) {
                axios({
                    method: 'post',
                    url: process.env.REACT_APP_URL_ENDPOINT_ADD,
                    data: res
                }).then(function (res) {

                    if (res.data.code !== 200) {

                        const {errors} = res.data

                        if (errors.first) {
                            setErrors('first', errors.first[0])
                        }

                        if (errors.last) {
                            setErrors('last', errors.last[0])
                        }

                        if (errors.email) {
                            setErrors('email', errors.email[0])
                        }

                        if (errors.address) {
                            setErrors('address', errors.address[0])
                        }

                    } else {
                        setShowSuccessModal(true)
                    }

                }).catch(function (error) {
                    setShowErrorModal(true)
                }).finally(() => {
                    setDisabledSubmit(false)
                });

            }

        }).catch(function (err) {
            setErrors(err.path, err.message)
            setDisabledSubmit(false)
        })
    }

    function setErrors(path, message) {
        switch (path) {
            case 'first':
                _SetErrorerrors({first: true, message: message})
                break
            case 'last':
                _SetErrorerrors({last: true, message: message})
                break
            case 'email':
                _SetErrorerrors({email: true, message: message})
                break
            case 'address':
                _SetErrorerrors({address: true, message: message})
                break
            default:
                false;
        }
    }

    return (
//TODO MAKE A CLASS CSS FOR PADDING IN MOBILE MODE


        <div className='div-form'>
            <Page>
                <Layout>
                    <Card sectioned>
                        <Form onSubmit={handleSubmit}>
                            <FormLayout>
                                <FormLayout.Group>
                                    <TextField
                                        type='text'
                                        value={first}
                                        label="First name"
                                        placeholder="Tom"
                                        onChange={handleFirstChange}
                                        name='first'
                                        id='first'
                                        error={(_errors.first === true) ? _errors.message : ""}
                                    />
                                    <TextField
                                        type='text'
                                        value={last}
                                        name='last'
                                        id='last'
                                        label="Last name"
                                        placeholder="Ford"
                                        onChange={handleLastChange}
                                        autoComplete="family-name"
                                        error={(_errors.last === true) ? _errors.message : ""}
                                    />
                                </FormLayout.Group>

                                <TextField
                                    value={email}
                                    label="Email"
                                    placeholder="example@email.com"
                                    onChange={handleEmailChange}
                                    autoComplete="email"
                                    type='email'
                                    name='email'
                                    id='email'
                                    error={(_errors.email === true) ? _errors.message : ""}
                                />

                                <TextField
                                    type='text'
                                    value={address}
                                    label="Address"
                                    placeholder="Address"
                                    onChange={handleAddressChange}
                                    autoComplete="address"
                                    name="address"
                                    id="address"
                                    error={(_errors.address === true) ? _errors.message : ""}
                                />

                                <Button submit primary id='buttonSubmit' disabled={disabledSubmit}>Submit</Button>
                            </FormLayout>
                        </Form>
                    </Card>
                </Layout>
            </Page>
            <SweetAlert
                show={showSuccessModal}
                title="Success"
                text="The user has been registered"
                type='success'
                onConfirm={handleSuccessModal}
            />
            <SweetAlert
                show={showErrorModal}
                title="Error"
                text="Ups, we have a problem try later"
                type='error'
                onConfirm={() => setShowErrorModal(false)}
            />
        </div>
    );
}
