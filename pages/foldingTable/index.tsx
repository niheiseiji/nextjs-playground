import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CollapsibleTable = () => {
  const [openTeams, setOpenTeams] = useState({});

  const toggleOpen = (teamId: string) => {
    setOpenTeams(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  // 列幅を固定するスタイル
  const columnStyles = {
    id: { width: '10%' },
    name: { width: '50%' },
    unitPrice: { width: '20%' },
    actions: { width: '20%', textAlign: 'right' }
  };

  // チームと商品のサンプルデータ
  const teams = [...Array(10).keys()].map(id => ({
    teamId: `team${id + 1}`,
    teamName: `チーム ${id + 1}`,
    products: [
      { id: id * 2 + 1, name: `商品 ${id * 2 + 1}`, unitPrice: 100 * (id + 1) },
      { id: id * 2 + 2, name: `商品 ${id * 2 + 2}`, unitPrice: 150 * (id + 1) }
    ]
  }));

  return (
    <TableContainer component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell style={columnStyles.id}>ID</TableCell>
            <TableCell style={columnStyles.name}>名前</TableCell>
            <TableCell style={columnStyles.unitPrice}>単価</TableCell>
            <TableCell style={columnStyles.actions}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map(team => (
            <>
              <TableRow key={team.teamId}  sx={{backgroundColor: "#1111111f"}}>
                <TableCell colSpan={4} style={{ ...columnStyles.name, textAlign: 'left' }}>{team.teamName}</TableCell>
                <TableCell style={columnStyles.actions}>
                  <IconButton onClick={() => toggleOpen(team.teamId)}>
                    {openTeams[team.teamId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
              {openTeams[team.teamId] && team.products.map(product => (
                <TableRow key={product.id}>
                  <TableCell style={columnStyles.id}>{product.id}</TableCell>
                  <TableCell style={columnStyles.name}>{product.name}</TableCell>
                  <TableCell style={columnStyles.unitPrice}>¥{product.unitPrice}</TableCell>
                  <TableCell style={columnStyles.actions}>詳細</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} style={columnStyles.name}>小計</TableCell>
                <TableCell colSpan={2} style={{ ...columnStyles.unitPrice, textAlign: 'right' }}>
                  ¥{team.products.reduce((sum, item) => sum + item.unitPrice, 0)}
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
