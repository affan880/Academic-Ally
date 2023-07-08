import { Avatar, Icon, IconButton } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'

import PdfViewerAction from '../../../screens/PdfViewer/pdfViewerAction';

interface Message {
    id: number;
    text: string;
}

interface Props {
}

const { width, height } = Dimensions.get('screen')

const ChatScreen: React.FC<Props> = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const test = () => {
        try {
            const response = "Welcome! I'm here to assist you with any questions you have. Feel free to ask me anything related to compute engines, processing engines, or any other topic you need help with. Here are a few example questions you can ask:\n\n1. What factors should be considered when choosing a processing engine?\n2. What are the differences between micro-batch processing and one-at-a-time processing?\n3. How do existing practices in an enterprise influence the choice of a processing engine?\n4. Can you provide examples of general-purpose distributed processing engines?\n5. What are the advantages of using Apache Spark for distributed processing?\n6. How do programming language preferences affect the selection of a processing engine?\n7. What are the considerations for achieving low response time in processing engines?\n8. Can you explain the concept of fast data borders in storage?\n\nFeel free to ask any of these questions or any other questions you may have!";
            const data = response;

            // Extracting welcome message
            const welcomeMsg = data.split('\n\n')[0];

            // Extracting questions
            const exampleQuestions = data.split('\n\n')[1];
            const questionsArray = exampleQuestions.split('\n');
            // console.log(questionsArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        test()
    }, [])

    const renderMessage = (item: Message) => {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    const sendMessage = () => {
        if (messageText.trim() !== '') {
            const newMessage: Message = {
                id: messages.length + 1,
                text: messageText,
            };
            setMessages([...messages, newMessage]);
            setMessageText('');
        }
    };

    return (
        <Modal visible={false}>
            <View style={styles.header}>
                <Avatar source={{
                    uri: "https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/logo%2FAcademicAllyLogo.png?alt=media&token=0c6b43ea-6d06-49b1-acdf-5516bed88f28"
                }} size={'lg'} alignSelf={'center'} />
                <Text style={styles.headerText} >
                    Lorem Ipsum
                </Text>
                <IconButton borderRadius={'xl'} _hover={{ bg: '#D3D3D3', }} onPress={() => { }} variant="ghost" icon={<Icon as={AntDesign} name="close" size={'lg'} color={'#000'} />} p={0} />
            </View>
            <View style={styles.modalContainer}>
                <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={10}>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => renderMessage(item)}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.messagesContainer}
                    // inverted
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder="Type your message..."
                            placeholderTextColor="#999"
                            multiline
                            underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    headerText: {
        color: '#000',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    container: {
        flex: 1,
    },
    messagesContainer: {
        flexGrow: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    messageContainer: {
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 8,
        marginBottom: 8,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 8,
        paddingVertical: 15
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
    },
    sendButton: {
        marginLeft: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 20,
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default ChatScreen;
