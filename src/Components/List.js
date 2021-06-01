import React from 'react'
import { ListGroup, Col } from 'react-bootstrap'

export default function Section(props) {
    const { header, data, onClick, isSelected } = props

    return (
        <Col xl={4} style={{ marginBottom: '2vh' }}>
            <h3>{header.replace(/_/g, ' ')}</h3>
            <ListGroup>
                {data.map((item) => (
                    <ListGroup.Item
                        key={item.id}
                        action
                        onClick={() => onClick(item)}
                        active={isSelected?.id === item.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span style={{ paddingRight: 20, fontSize: '1.2rem' }}>
                            {item.name}
                        </span>
                        <span>{`$${item.lowPrice} - $${item.highPrice}`}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Col>
    )
}
