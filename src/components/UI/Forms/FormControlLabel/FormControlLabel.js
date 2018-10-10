import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = {
    root: {
        display : "inline-block",
        width : "30%"
    },
  }

export default withStyles(styles)(FormControlLabel)