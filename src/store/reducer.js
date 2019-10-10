const defaultState = {
    inputValue: 'Write Something',
    list: [
        '早上4点起床，锻炼身体',
        '中午下班游泳一小时'
    ]
}
export default (state = defaultState, action) => {
     let newState = JSON.parse(JSON.stringify(state))
     newState.inputValue = action.value
     return newState
    return state
}