import './App.css'
import { useState } from 'react'
import useGetItems from './useGetItems'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Section from './Components/List'
import { Container, Row, Col, Jumbotron, Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

firebase.initializeApp({
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
})

function App() {
    const { itemSections, fetchItems, saveChecklist } = useGetItems()
    const [budget, setBudget] = useState()
    const [userInput, setUserInput] = useState('')
    const [selectedItems, setSelectedItems] = useState({})
    const [cartTotals, setCartTotals] = useState({
        min: 0,
        max: 0,
        status: 'Under',
    })

    function handleAddItem(item) {
        let min = cartTotals.min + item.lowPrice
        let max = cartTotals.max + item.highPrice
        if (selectedItems[item.type]) {
            min -= selectedItems[item.type].lowPrice
            max -= selectedItems[item.type].highPrice
        }

        if (item.id === selectedItems[item.type]?.id) {
            min -= selectedItems[item.type].lowPrice
            max -= selectedItems[item.type].highPrice
            let tempItems = { ...selectedItems }
            delete tempItems[item.type]
            setSelectedItems(tempItems)
        } else {
            setSelectedItems((prev) => {
                return { ...prev, [item.type]: item }
            })
        }

        let status = 'Within'
        if (+budget < min) status = 'Over'
        else if (+budget > max) status = 'Under'
        setCartTotals({
            min,
            max,
            status,
        })
    }

    function handleBudgetSet(event) {
        event.preventDefault()
        event.stopPropagation()
        if (userInput) {
            fetchItems(userInput)
            setBudget(userInput)
            setUserInput('')
        }
    }

    return (
        <Container fluid style={{ padding: 0 }}>
            <Jumbotron
                fluid
                style={{
                    textAlign: 'center',
                    height: 50,
                }}
            >
                <h1>Nick Peck's Budget Calculator</h1>
            </Jumbotron>

            <Container fluid={'xl'}>
                <Form onSubmit={handleBudgetSet}>
                    <Form.Group>
                        <Form.Label>Budget</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='1000'
                            value={userInput}
                            onChange={(event) =>
                                setUserInput(event.target.value)
                            }
                        />
                        <Form.Text className='text-muted'>
                            Submit your budget to see beautiful options within
                            your budget
                        </Form.Text>
                    </Form.Group>
                    <Button size='lg' type='submit' variant='outline-primary'>
                        See Options
                    </Button>
                </Form>
                {budget && (
                    <>
                        <Row style={{ marginTop: '2vh', marginBot: '4vh' }}>
                            <Col>
                                <h2>
                                    {cartTotals.status} Budget: ${budget}
                                </h2>
                            </Col>
                            <Col>
                                <h2>
                                    Current Price: ${cartTotals.min} - $
                                    {cartTotals.max}
                                </h2>
                            </Col>
                            <Col>
                                <Button
                                    size='lg'
                                    type='submit'
                                    variant='outline-success'
                                    style={{ float: 'right' }}
                                    onClick={() =>
                                        saveChecklist(selectedItems, budget)
                                    }
                                >
                                    Save List
                                </Button>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            {Object.entries(itemSections).map(
                                ([key, items]) => (
                                    <Section
                                        key={key}
                                        header={key}
                                        data={items}
                                        isSelected={selectedItems[key]}
                                        onClick={handleAddItem}
                                    />
                                )
                            )}
                        </Row>
                    </>
                )}
            </Container>
        </Container>
    )
}

export default App
