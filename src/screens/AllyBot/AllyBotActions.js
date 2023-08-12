import { Toast } from "native-base";

const { firestoreDB } = require("../../Modules/auth/firebase/firebase");
const { setInitiatedChatList } = require("./AllyBotSlice");

class AllyBotActions {
    static loadInitiatedChats = (uid) => (dispatch) => {
        const query = firestoreDB()
          .collection('Users')
          .doc(uid)
          .collection('InitializedPdf');
      
        const unsubscribe = query.onSnapshot((querySnapshot) => {
          const documents = querySnapshot.docs
            .map((doc) => {
              const data = doc.data();
              const date = data.date.toDate();
              if((data?.conversations)?.length > 0){
                return { date, docId: doc.id, subject: data.subject, name: data.name, lastConversation: data?.conversations[(data.conversations)?.length - 1] };
              }
              else {
                return { date, docId: doc.id, subject: data.subject, name: data.name, lastConversation: {
                    date: null,
                    sender: 'AllyBot',
                    message: 'no message'
                } };
              }
            })
            .sort((a, b) => b.date - a.date);
          dispatch(setInitiatedChatList(documents));
        }, (error) => {
          console.error('Error getting documents:', error);
        //   setInitiatedChatList([]);
        });
        return unsubscribe;
    }      
    static deleteChat = (uid, id) => {
      firestoreDB().collection('Users').doc(uid).collection('InitializedPdf').doc(id).delete().then(()=>{
        Toast.show({
          title: 'Deleted Chat',
          backgroundColor: '#FF0000'
        })
      })
    }
}

export default AllyBotActions