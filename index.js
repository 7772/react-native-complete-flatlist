import React, { Component } from "react";
import Highlighter from "react-native-highlight-words";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  RefreshControl,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";

class CompleteFlatList extends Component {
  state = {
    behavior: "padding",
    refreshing: false,
    searchText: ""
  };

  componentDidMount() {
    if (this.props.pullToRefreshCallback !== null) {
      this.props.pullToRefreshCallback();
    }
  }

  onRefresh = () => {
    this.props.pullToRefreshCallback();
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 7000);
  };

  refresh = () => {
    if (this.props.data.length === 0) {
      filtereddata = [{ type: "emptyrow", name: "No data available" }];
    }
    filtereddata = this.props.data;
    this.setState({ refreshing: false, data: filtereddata });
  };

  filterText = () => {
    const { data, searchKey, highlightColor } = this.props;
    if (this.state.searchText === "") {
      return data;
    }
    const searchText = this.state.searchText.toLowerCase();
    const filteredData = [];
    for (let d = 0; d < data.length; d += 1) {
      dt = data[d];
      for (let s = 0; s < searchKey.length; s += 1) {
        sk = searchKey[s];
        const target = dt[sk];
        if (typeof target === "undefined" || target == null) {
          continue;
        }
        if (target.toLowerCase().indexOf(searchText) !== -1) {
          if (highlightColor === "") {
            filteredData.push(dt);
            break;
          }
          const row = {};
          const keys = Object.keys(dt);
          for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            if (typeof dt[key] === "string") {
              row[key] = (
                <Highlighter
                  highlightStyle={{ backgroundColor: highlightColor }}
                  searchWords={[searchText]}
                  textToHighlight={dt[key]}
                />
              );
            }
          }
          filteredData.push(row);
          break;
        }
      }
    }
    return filteredData;
  };

  render() {
    const {
      renderItem,
      renderSeparator,
      pullToRefreshCallback,
      backgroundStyles,
      searchBarBackgroundStyles
    } = this.props;
    const filteredData = this.filterText();
    if (filteredData.length === 0) {
      filteredData.push({ showEmptyRow: true });
    }

    const searchbar = (
      <View style={[styles.searchBarContainer, searchBarBackgroundStyles]}>
        <TextInput
          style={styles.searchBar}
          placeholder={this.props.placeholder}
          clearButtonMode="while-editing"
          placeholderTextColor="#919188"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={searchText => this.setState({ searchText })}
          value={this.state.searchText}
          maxLength={100}
        />
      </View>
    );

    return (
      <KeyboardAvoidingView
        behavior={this.state.behavior}
        style={[styles.container, backgroundStyles]}
      >
        {this.props.searchKey.length > 0 && searchbar}
        {this.props.elementBetweenSearchAndList}
        <FlatList
          refreshControl={
            pullToRefreshCallback !== null ? (
              <RefreshControl
                refreshing={this.props.isRefreshing}
                onRefresh={this.props.pullToRefreshCallback}
              />
            ) : null
          }
          data={filteredData}
          renderItem={item =>
            filteredData.length === 1 &&
            filteredData[0].showEmptyRow !== null &&
            typeof filteredData[0].showEmptyRow !== "undefined"
              ? this.props.renderEmptyRow()
              : renderItem(item.item)
          }
          style={styles.flatList}
          ItemSeparatorComponent={renderSeparator}
        />
      </KeyboardAvoidingView>
    );
  }
}

CompleteFlatList.propTypes = {
  searchKey: PropTypes.array,
  data: PropTypes.array,
  renderItem: PropTypes.func,
  renderSeparator: PropTypes.func,
  pullToRefreshCallback: PropTypes.func,
  highlightColor: PropTypes.string,
  isRefreshing: PropTypes.bool,
  backgroundStyles: PropTypes.object,
  searchBarBackgroundStyles: PropTypes.object,
  renderEmptyRow: PropTypes.func,
  placeholder: PropTypes.string,
  elementBetweenSearchAndList: PropTypes.element
};
CompleteFlatList.defaultProps = {
  searchKey: [],
  placeholder: "Search ...",
  data: [],
  isRefreshing: false,
  renderItem: null,
  renderSeparator: () => <View style={styles.defaultSeparator} />,
  pullToRefreshCallback: null,
  highlightColor: "",
  backgroundStyles: {},
  searchBarBackgroundStyles: {},
  renderEmptyRow: () => (
    <Text style={styles.noData}>{"No data available"}</Text>
  ),
  elementBetweenSearchAndList: null
};

const styles = StyleSheet.create({
  noData: { alignSelf: "center", textAlign: "center", marginTop: 20 },
  searchBarContainer: {
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f2f2f2",
    width: "100%"
  },
  searchBar: {
    borderRadius: 5,
    backgroundColor: "white",
    height: 38,
    fontSize: 15,
    width: "100%",
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  defaultSeparator: {
    height: 1,
    width: "80%",
    alignSelf: "center",
    backgroundColor: "#f2f2f2"
  },
  flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
});

export default CompleteFlatList;
