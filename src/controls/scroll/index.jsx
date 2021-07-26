import React from "react";
import BScroll from "better-scroll";
import PropTypes from "prop-types";

class Scroll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollData: [],
    };

    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this._initScroll();
    }, 8);
  }
  render() {
    return (
      <div ref={this.wrapperRef} {...this.props}>
        {this.props.children}
      </div>
    );
  }
  _initScroll() {
    if (!this.wrapperRef.current) {
      return;
    }
    let me = this;

    this.scroll = new BScroll(this.wrapperRef.current, {
      probeType: this.props.probeType,
      click: this.props.click,
    });

    if (this.props.scroll) {
      this.scroll.on("scroll", (pos) => {
        me.props.scroll(pos);
      });
    }
    if (this.props.scrollStart) {
      this.scroll.on("scrollStart", () => {
        me.props.scrollStart();
      });
    }

    if (this.props.scrollEnd) {
      this.scroll.on("scrollEnd", (x, y) => {
        me.props.scrollEnd(x, y);
      });
    }

    if (this.props.pullUp) {
      this.scroll.on("scrollEnd", () => {
        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
          this.props.scrollToEnd();
        }
      });
    }

    if (this.props.beforeScroll) {
      this.scroll.on("beforeScrollStart", () => {
        this.props.onBeforeScroll();
      });
    }
  }

  refresh() {
    this.scroll && this.scroll.refresh();
  }
  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
  }
  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
  }
  destroy() {
    this.scroll && this.scroll.destroy();
  }
}

Scroll.propTypes = {
  probeType: PropTypes.number,
  click: PropTypes.bool,
  data: PropTypes.array,
  scrollStart: PropTypes.func,
  scroll: PropTypes.func,
  scrollEnd: PropTypes.func,
  pullUp: PropTypes.bool,
  scrollToEnd: PropTypes.func,
  beforeScroll: PropTypes.bool,
};

Scroll.defaultProps = {
  probeType: 1,
  click: true,
  data: null,
  pullUp: false,
};

export default Scroll;
