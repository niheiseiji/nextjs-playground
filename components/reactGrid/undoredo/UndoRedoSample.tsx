import * as React from "react";
import { render } from "react-dom";
import {
    ReactGrid,
    Column,
    Row,
    CellChange,
    TextCell
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
// import "./styles.css";

interface Person {
    name: string;
    surname: string;
}

const getPeople = (): Person[] => [
    { name: "テスト太郎", surname: "test text 1" },
    { name: "テスト次郎", surname: "test text 2" },
    { name: "", surname: "" }
];

const getColumns = (): Column[] => [
    { columnId: "name", width: 150 },
    { columnId: "surname", width: 150 }
];

const headerRow: Row = {
    rowId: "header",
    cells: [
        { type: "header", text: "Name" },
        { type: "header", text: "Note" }
    ]
};

const getRows = (people: Person[]): Row[] => [
    headerRow,
    ...people.map<Row>((person, idx) => ({
        rowId: idx,
        cells: [
            { type: "text", text: person.name },
            { type: "text", text: person.surname }
        ]
    }))
];

export const UndoRedoSample: React.FC = () => {
    // 現在のデータ本体
    const [people, setPeople] = React.useState<Person[]>(getPeople());
    // 現在のデータ履歴位置(-1がcurrentで更新のたびに+1していく。cellChangesのインデックスとして使う。)
    const [cellChangesIndex, setCellChangesIndex] = React.useState(() => -1);
    // 変更セルsを配列で保持する。1変更タイミングにつき1要素を持つ。1変更タイミングで複数セル変更にも対応。変更【前後】の値を持つ
    const [cellChanges, setCellChanges] = React.useState<
        CellChange<TextCell>[][]
    >(() => []);

    // 今回更新分を反映した全量データを返す
    const applyNewValue = (
        changes: CellChange<TextCell>[],
        prevPeople: Person[],
        usePrevValue: boolean = false
    ): Person[] => {
        changes.forEach((change) => {
            const personIndex = change.rowId;
            const fieldName = change.columnId;
            const cell = usePrevValue ? change.previousCell : change.newCell;
            prevPeople[personIndex][fieldName] = cell.text;
        });
        return [...prevPeople];
    };

    // private
    const applyChangesToPeople = (
        changes: CellChange<TextCell>[],
        prevPeople: Person[]
    ): Person[] => {
        setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]); //現在値以降の要素を削除と今回の変更をセット
        setCellChangesIndex(cellChangesIndex + 1);
        const updated: Person[] = applyNewValue(changes, prevPeople);// 更新データ
        return updated;
    };

    const rows = getRows(people);
    const columns = getColumns();

    const handleChanges = (changes: CellChange<TextCell>[]) => {
        setPeople((prevPeople) => applyChangesToPeople(changes, prevPeople));
    };

    const undoChanges = (
        changes: CellChange<TextCell>[],
        prevPeople: Person[]
    ): Person[] => {
        const updated = applyNewValue(changes, prevPeople, true);
        setCellChangesIndex(cellChangesIndex - 1);
        return updated;
    };
    // cellChangesIndex     min:-1
    const handleUndoChanges = () => {
        if (cellChangesIndex >= 0) {// -1のときは戻れない
            setPeople((prevPeople) =>
                undoChanges(cellChanges[cellChangesIndex], prevPeople)
            );
        }
    };

    const redoChanges = (
        changes: CellChange<TextCell>[],
        prevPeople: Person[]
    ): Person[] => {
        const updated = applyNewValue(changes, prevPeople);
        setCellChangesIndex(cellChangesIndex + 1);
        return updated;
    };
    // cellChangesIndex     min:-1
    // cellChanges.length   min: 0
    const handleRedoChanges = () => {
        if (cellChangesIndex + 1 <= cellChanges.length - 1) {
            setPeople((prevPeople) =>
                redoChanges(cellChanges[cellChangesIndex + 1], prevPeople)
            );
        }
    };

    return (
        <div
            onKeyDown={(e) => {
                switch (e.key) {
                    case "z":
                        handleUndoChanges();
                        return;
                    case "y":
                        handleRedoChanges();
                        return;
                }
            }}
        >
            <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges} enableRangeSelection
                enableColumnSelection />
            <button onClick={handleUndoChanges}>戻る</button>
            <button onClick={handleRedoChanges}>進む</button>
            {/* debug */}
            {/* <div>
                <strong>People:</strong>
                <pre>{JSON.stringify(people, null, 2)}</pre>
            </div>
            <div>
                <strong>Cell Changes Index:</strong>
                <pre>{cellChangesIndex}</pre>
            </div>
            <div>
                <strong>Cell Changes:</strong>
                <pre>{JSON.stringify(cellChanges, null, 2)}</pre>
            </div> */}
        </div>
    );
}
