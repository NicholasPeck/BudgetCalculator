import { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

const useGetItems = () => {
    const db = firebase.firestore()

    const [itemSections, setItemSections] = useState({})

    async function fetchItems(budget) {
        let { docs } = await db
            .collection('nickPeckBudgetResponses')
            // .where('highPrice', '<=', +budget * 100)
            .get()
        let formattedData = {}
        docs.forEach((doc) => {
            const item = doc.data()
            console.log(item, doc.id)
            if (!formattedData[item.type]) {
                formattedData[item.type] = []
            }
            formattedData[item.type].push({
                ...item,
                lowPrice: item.lowPrice / 100,
                highPrice: item.highPrice / 100,
                id: doc.id,
            })
        })

        setItemSections(formattedData)
    }
    async function saveChecklist(listObj, budget) {
        let item_ids = Object.values(listObj).map(({ id }) => id)
        let formattedData = {
            item_ids,
            budget: +budget * 100,
            time: new Date().toISOString(),
        }

        const res = await db.collection('nickPeckBudgetResponses').add({
            ...formattedData,
        })
        console.log(res)
    }

    return { itemSections, saveChecklist, fetchItems }
}

export default useGetItems
