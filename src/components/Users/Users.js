import React, {useState, useEffect, useCallback} from 'react';
import {
    Page,
    Card,
    DataTable,
    Pagination,
    Link
} from '@shopify/polaris';

import './Users.css'

import axios from "axios";

export function Users() {

    const [users, setUsers] = useState(0);
    const [lastPage, setLastPage] = useState(0);
    const [offsetPage, setOffsetPage] = useState(0);
    const [pagination, setPagination] = useState({from: 0, to: 0, prev: false, next: false});
    const [rows, setRows] = useState([])

    const handleNextPage = useCallback(() => {
        getUsers('next')
    });

    const handlePrevPage = useCallback(() => {
        getUsers('prv')
    });

    useEffect(() => {
        getUsers(null)
    }, []);


    const getUsers = async (origin) => {
        let auxRows = []

        const page = (origin === 'next' || origin === null) ? offsetPage + 1 : offsetPage - 1

        axios.get(`${process.env.REACT_APP_URL_ENDPOINT_LIST}?page=${page}`)
            .then(function (response) {
                const pagination = response.data

                if (pagination.data.length > 0) {
                    for (const user of pagination.data) {
                        const url = `https://www.google.com/maps/search/${user.address}/`
                        auxRows.push([
                            `${user.first_name} ${user.last_name}`,
                            user.email,
                            <Link url={url} external>{user.address}</Link>
                        ])
                    }

                    if (origin === 'next') {
                        if (page < lastPage) {
                            setPagination({from: pagination.from, to: pagination.to, prev: true, next: true})
                        } else {
                            setPagination({from: pagination.from, to: pagination.to, prev: true, next: false})
                        }
                    } else {
                        if (page === 1) {
                            setPagination({from: pagination.from, to: pagination.to, prev: false, next: true})
                        } else {
                            setPagination({from: pagination.from, to: pagination.to, prev: true, next: true})
                        }
                    }

                } else {
                    setPagination({from: pagination.from, to: pagination.to, prev: false, next: false})
                }

                setRows(auxRows);
                setUsers(pagination.total);
                setLastPage(pagination.last_page);
            })
            .catch(function (error) {
                console.log(error);
                return {rows: auxRows, total: 0}
            }).finally(() => {
            setOffsetPage(page)
        })
    }


    return (
        <Page title="Users">
            <Card>

                <DataTable
                    columnContentTypes={[
                        'text',
                        'text',
                        'text'
                    ]}
                    headings={[
                        'Name',
                        'Email',
                        'Address'
                    ]}
                    rows={rows}
                    footerContent={`Showing from ${pagination.from} to ${pagination.to} of ${users} results`}
                />
                <div className="pagination">
                    <Pagination
                        label="Results"
                        hasPrevious={pagination.prev}
                        onPrevious={handlePrevPage}
                        hasNext={pagination.next}
                        onNext={handleNextPage}
                    />
                </div>
            </Card>
        </Page>
    );
}