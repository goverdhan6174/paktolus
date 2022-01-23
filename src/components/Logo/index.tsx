import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import LogoSvg from './logo.svg';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        margin-top: 4px;
        transform: scale(.8);
`
);

// const VersionBadge = styled(Box)(
//   ({ theme }) => `
//         background: ${theme.palette.success.main};
//         color: ${theme.palette.success.contrastText};
//         padding: ${theme.spacing(0.4, 1)};
//         border-radius: ${theme.general.borderRadiusSm};
//         text-align: center;
//         display: inline-block;
//         line-height: 1;
//         font-size: ${theme.typography.pxToRem(11)};
// `
// );

function Logo() {
  return (
    <LogoWrapper to="/play">
      <LogoSignWrapper>
        <img src={LogoSvg} alt="Paktolus's logo" />
      </LogoSignWrapper>
    </LogoWrapper>
  );
}

export default Logo;
