function pauseQuiz() {
  const { timerOn } = this.state;
  if (timerOn) {
    clearInterval(this.timer);
    this.setState({ timerOn: false });
  }
}

function resumeQuiz() {
  const { timerOn, time } = this.state;
  if (!timerOn) {
    const x = Date.now() - time;
    this.setState({ timerOn: true });
    this.timer = setInterval(() => this.setState({ time: Date.now() - x }), 1000);
  }
}

export { pauseQuiz, resumeQuiz };
