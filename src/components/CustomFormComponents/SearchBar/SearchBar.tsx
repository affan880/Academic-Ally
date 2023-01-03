import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Dimensions } from 'react-native';
import createStyles from './styles';
import Feather from "react-native-vector-icons/Feather"

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const SearchBar = () => {
    const styles = useMemo(() => createStyles(), []);
    const [searchTerm, setSearchTerm]:any = useState('');
    const [suggestions, setSuggestions]: any = useState([]);
    const [found, setFound]: any = useState(false)

    const searchSuggestions = [
        'Mathematics-1',
        'PPS',
        'Physics',
        'Chemistry',
        'Social',
    ];

    const handleSearch = (text:string) => {
        setSearchTerm(text);
        const filteredSuggestions = searchSuggestions.filter((suggestion) => suggestion.toUpperCase().includes(text.toUpperCase()));
        setSuggestions(filteredSuggestions);
        suggestions.length == 0 ? setFound(false) : setFound(true)
    };

    const handleSuggestionPress = (suggestion:any) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
        // perform search or other actions based on the selected suggestion
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer} >
                <Feather name="search" size={20} color="#000000" style={styles.leftIcon} />
            <TextInput
                style={styles.input}
                value={searchTerm}
                onChangeText={handleSearch}
                placeholder="Search"
                />
            </View>
            {suggestions.length > 0 && searchTerm != "" && (
                <FlatList
                    data={suggestions}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item} 
                />
            )}
        </View>
    );
};

export default SearchBar;
