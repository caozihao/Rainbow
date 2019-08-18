console.log('version:0.1');

setTimeout(() => {
  const myWindow: any = window;
  console.log('myWindow.g_app._store ->', myWindow.g_app._store);
});

console.log = () => {};

// history.listen(({ query }) => {
//   const { callId, tid } = query;
//   const { showSearchDetail } = this.props;
//   if (!callId && showSearchDetail) {
//     dispatch({ type: 'search/toggleSearchDetailShow', payload: false });
//     return;
//   }
//   // 同一录音也需要请求，不然裁剪后，播放片段会显示不出裁剪
//   this.fetchCall(callId, tid);
// });
// }
