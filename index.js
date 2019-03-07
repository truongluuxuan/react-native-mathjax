import React from 'react';
import { View, WebView } from 'react-native';

const defaultOptions = {
	messageStyle: 'none',
	extensions: [ 'tex2jax.js' ],
	jax: [ 'input/TeX', 'output/HTML-CSS' ],
	tex2jax: {
		inlineMath: [ ['$','$'], ['\\(','\\)'] ],
		displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
		processEscapes: true,
	},
	"HTML-CSS": { linebreaks: { automatic: true } },
                      CommonHTML: { linebreaks: { automatic: true } },
	TeX: {
		extensions: ['AMSmath.js','AMSsymbols.js','noErrors.js','noUndefined.js']
	}
};

class MathJax extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 1
		};
	}

	handleMessage(message) {
		this.setState({
			height: Number(message.nativeEvent.data)
		});
	}

	wrapMathjax(content) {
		const options = JSON.stringify(
			Object.assign({}, defaultOptions, this.props.mathJaxOptions)
		);

		return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});

				MathJax.Hub.Queue(function() {
					var height = document.documentElement.scrollHeight;

					window.postMessage(String(height));
				});
			</script>

			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>

			${content}
		`;
	}
	render() {
		const html = this.wrapMathjax(this.props.html);

		// Create new props without `props.html` field. Since it's deprecated.
		const props = Object.assign({}, this.props, { html: undefined });

		return (
      <View style={{ height: this.state.height, ...props.style }}>
        <WebView
		originWhitelist={['*']}
          scrollEnabled={false}
          onMessage={ this.handleMessage.bind(this) }
          source={{ baseUrl: '' ,html }}
          {...props}
        />
      </View>
		);
	}
}

export default MathJax;
