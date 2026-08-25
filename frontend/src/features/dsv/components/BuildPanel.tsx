import React, { useState } from 'react';
import { useDsvStore } from '../store/dsvStore';
import * as BT from '../algorithms/binaryTree';
import * as PBT from '../algorithms/plainBinaryTree';
import * as LL from '../algorithms/linkedList';
import * as GR from '../algorithms/graph';
import * as GT from '../algorithms/generalTree';
import { formatNodeLabel } from '../utils/formatLabel';
const field =
  'h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/15 dark:bg-[#1a1028] dark:text-white';
const btn =
  'rounded-lg bg-[#ff97b2] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#ff80a3] disabled:opacity-40';
const btnGhost =
  'rounded-lg border border-[#ff97b2]/40 px-3 py-1.5 text-xs font-semibold text-[#f07f97] hover:bg-[#ff97b2]/10 disabled:opacity-40 dark:border-white/20 dark:text-[#ffc4d6]';

export const BuildPanel: React.FC = () => {
  const structure = useDsvStore((s) => s.structure);
  const selectedNodeId = useDsvStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDsvStore((s) => s.selectedEdgeId);
  const commitChange = useDsvStore((s) => s.commitChange);
  const setMessage = useDsvStore((s) => s.setMessage);
  const clearStructure = useDsvStore((s) => s.clearStructure);

  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');

  const parseVal = (): number | null => {
    const n = Number(value);
    if (value.trim() === '' || Number.isNaN(n)) {
      setMessage('Δώσε έγκυρη αριθμητική τιμή.', 'error');
      return null;
    }
    return n;
  };

  const needLabel = (): string | null => {
    const t = label.trim();
    if (!t) {
      setMessage('Δώσε όνομα/ετικέτα.', 'error');
      return null;
    }
    return t;
  };

  if (structure.kind === 'bst') {
    const data = structure.data;
    return (
      <div className="flex flex-wrap items-end gap-2">
        <input
          className={`${field} w-28`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Τιμή"
          inputMode="numeric"
        />
        <button
          type="button"
          className={btn}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            const r = BT.insertBinaryTree(data, v);
            commitChange(
              { kind: 'bst', data: r.tree },
              `Προστέθηκε ο ${v}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν έγινε εισαγωγή.'
            );
          }}
        >
          Προσθήκη
        </button>
        <button
          type="button"
          className={btnGhost}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            const r = BT.deleteBinaryTree(data, v);
            commitChange(
              { kind: 'bst', data: r.tree },
              `Διαγράφηκε ο ${v}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν βρέθηκε για διαγραφή.'
            );
          }}
        >
          Διαγραφή
        </button>
        <button type="button" className={btnGhost} onClick={clearStructure}>
          Από την αρχή
        </button>
      </div>
    );
  }

  if (structure.kind === 'binary-tree') {
    const data = structure.data;
    return (
      <div className="flex flex-wrap items-end gap-2">
        <input
          className={`${field} w-28`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Τιμή"
          inputMode="numeric"
        />
        <button
          type="button"
          className={btn}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            const r = PBT.insertBinaryChild(data, null, 'root', v);
            commitChange(
              { kind: 'binary-tree', data: r.tree },
              `Ρίζα: ${v}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν μπορεί να οριστεί ρίζα.'
            );
          }}
        >
          Ρίζα
        </button>
        <button
          type="button"
          className={btn}
          disabled={!selectedNodeId}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            if (!selectedNodeId) {
              setMessage('Επίλεξε πρώτα έναν κόμβο.', 'error');
              return;
            }
            const r = PBT.insertBinaryChild(data, selectedNodeId, 'left', v);
            commitChange(
              { kind: 'binary-tree', data: r.tree },
              `Αριστερό παιδί: ${v}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν μπορεί να προστεθεί αριστερά.'
            );
          }}
        >
          Αριστερά
        </button>
        <button
          type="button"
          className={btn}
          disabled={!selectedNodeId}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            if (!selectedNodeId) {
              setMessage('Επίλεξε πρώτα έναν κόμβο.', 'error');
              return;
            }
            const r = PBT.insertBinaryChild(data, selectedNodeId, 'right', v);
            commitChange(
              { kind: 'binary-tree', data: r.tree },
              `Δεξί παιδί: ${v}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν μπορεί να προστεθεί δεξιά.'
            );
          }}
        >
          Δεξιά
        </button>
        <button
          type="button"
          className={btnGhost}
          disabled={!selectedNodeId}
          onClick={() => {
            if (!selectedNodeId) {
              setMessage('Επίλεξε κόμβο για διαγραφή.', 'error');
              return;
            }
            const r = PBT.deleteBinaryNodeById(data, selectedNodeId);
            commitChange(
              { kind: 'binary-tree', data: r.tree },
              'Ο κόμβος διαγράφηκε.',
              r.steps[r.steps.length - 1]?.explanation ?? 'Αποτυχία διαγραφής.'
            );
            useDsvStore.getState().selectNode(null);
          }}
        >
          Διαγραφή
        </button>
        <button type="button" className={btnGhost} onClick={clearStructure}>
          Από την αρχή
        </button>
      </div>
    );
  }

  if (structure.kind === 'general-tree') {
    const data = structure.data;
    return (
      <div className="flex flex-wrap items-end gap-2">
          <input
            className={`${field} w-32`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Όνομα κόμβου"
          />
          <button
            type="button"
            className={btn}
            onClick={() => {
              const name = needLabel();
              if (!name) return;
              if (!data.rootId) {
                const rootId = `gt_${Date.now().toString(36)}`;
                commitChange(
                  {
                    kind: 'general-tree',
                    data: {
                      rootId,
                      nodes: { [rootId]: { id: rootId, label: name, children: [] } },
                    },
                  },
                  `Ρίζα: ${name}. Επίλεξέ την και πρόσθεσε παιδιά.`
                );
                setLabel('');
                return;
              }
              if (!selectedNodeId) {
                setMessage(
                  'Πάτα πρώτα έναν κόμβο στο δέντρο για να γίνει γονέας, μετά «Προσθήκη παιδιού».',
                  'error'
                );
                return;
              }
              const r = GT.addChild(data, selectedNodeId, name);
              commitChange(
                { kind: 'general-tree', data: r.tree },
                `Το «${name}» προστέθηκε ως παιδί του «${data.nodes[selectedNodeId]?.label}».`,
                r.steps[r.steps.length - 1]?.explanation ?? 'Αποτυχία προσθήκης.'
              );
              setLabel('');
            }}
          >
            {data.rootId ? 'Προσθήκη παιδιού' : 'Ρίζα'}
          </button>
          <button
            type="button"
            className={btnGhost}
            disabled={!selectedNodeId}
            onClick={() => {
              if (!selectedNodeId) {
                setMessage('Επίλεξε κόμβο για διαγραφή.', 'error');
                return;
              }
              const r = GT.deleteNode(data, selectedNodeId);
              commitChange(
                { kind: 'general-tree', data: r.tree },
                'Ο κόμβος διαγράφηκε.',
                r.steps[r.steps.length - 1]?.explanation ?? 'Αποτυχία διαγραφής.'
              );
              useDsvStore.getState().selectNode(null);
            }}
          >
            Διαγραφή
          </button>
          <button type="button" className={btnGhost} onClick={clearStructure}>
            Από την αρχή
          </button>
      </div>
    );
  }

  if (structure.kind === 'linked-list') {
    const data = structure.data;
    return (
      <div className="flex flex-wrap items-end gap-2">
        <input
          className={`${field} w-28`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Τιμή"
          inputMode="numeric"
        />
        <button
          type="button"
          className={btn}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            const r = LL.insertBeginning(data, v);
            commitChange(
              { kind: 'linked-list', data: r.list },
              `Προστέθηκε ο ${v} στην αρχή.`,
              'Δεν έγινε προσθήκη.'
            );
          }}
        >
          Προσθήκη αρχή
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            const r = LL.insertEnd(data, v);
            commitChange(
              { kind: 'linked-list', data: r.list },
              `Προστέθηκε ο ${v} στο τέλος.`,
              'Δεν έγινε προσθήκη.'
            );
          }}
        >
          Προσθήκη τέλος
        </button>
        <button
          type="button"
          className={btn}
          disabled={!selectedNodeId}
          title="Επίλεξε κόμβο στη λίστα και πρόσθεσε μετά από αυτόν"
          onClick={() => {
            const v = parseVal();
            if (v === null) return;
            if (!selectedNodeId) {
              setMessage('Επίλεξε έναν κόμβο για να προσθέσεις μετά από αυτόν.', 'error');
              return;
            }
            const afterVal = data.nodes[selectedNodeId]?.value;
            const r = LL.insertAfter(data, selectedNodeId, v);
            commitChange(
              { kind: 'linked-list', data: r.list },
              `Προστέθηκε ο ${v} μετά τον ${afterVal}.`,
              r.steps[r.steps.length - 1]?.explanation ?? 'Δεν έγινε προσθήκη.'
            );
          }}
        >
          Μετά από επιλεγμένο
        </button>
        <button
          type="button"
          className={btnGhost}
          onClick={() => {
            const r = LL.deleteBeginning(data);
            commitChange(
              { kind: 'linked-list', data: r.list },
              'Διαγράφηκε ο πρώτος κόμβος.',
              r.steps[r.steps.length - 1]?.explanation ?? 'Η λίστα είναι κενή.'
            );
          }}
        >
          Διαγραφή αρχής
        </button>
        <button type="button" className={btnGhost} onClick={clearStructure}>
          Από την αρχή
        </button>
      </div>
    );
  }

  if (structure.kind !== 'directed-graph' && structure.kind !== 'undirected-graph') {
    return null;
  }

  const data = structure.data;
  const vertices = Object.values(data.vertices);
  const directed = structure.kind === 'directed-graph';
  const kind = structure.kind;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <input
          className={`${field} min-w-0 flex-1 sm:w-28 sm:flex-none`}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Κορυφή"
        />
        <button
          type="button"
          className={btn}
          onClick={() => {
            const name = needLabel();
            if (!name) return;
            const r = GR.addVertex(data, name);
            commitChange(
              { kind, data: r.graph },
              `Προστέθηκε η κορυφή ${name}. Πάτα την στο canvas για να την επιλέξεις.`,
              'Αποτυχία προσθήκης κορυφής.'
            );
            setLabel('');
          }}
        >
          + Κορυφή
        </button>
      </div>
      <div className="flex min-w-0 flex-nowrap items-end gap-2 overflow-x-auto">
        <select
          className={`${field} min-w-0 flex-1`}
          value={edgeSource}
          onChange={(e) => setEdgeSource(e.target.value)}
          aria-label="Από"
        >
          <option value="">Από</option>
          {vertices.map((v) => (
            <option key={v.id} value={v.id}>
              {formatNodeLabel(v.label, 12)}
            </option>
          ))}
        </select>
        <select
          className={`${field} min-w-0 flex-1`}
          value={edgeTarget}
          onChange={(e) => setEdgeTarget(e.target.value)}
          aria-label="Προς"
        >
          <option value="">Προς</option>
          {vertices.map((v) => (
            <option key={v.id} value={v.id}>
              {formatNodeLabel(v.label, 12)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={`${btn} shrink-0`}
          onClick={() => {
            if (!edgeSource || !edgeTarget) {
              setMessage('Διάλεξε πηγή και προορισμό.', 'error');
              return;
            }
            const r = GR.addEdge(data, edgeSource, edgeTarget, !directed);
            commitChange(
              { kind, data: r.graph },
              'Η ακμή προστέθηκε.',
              r.steps[r.steps.length - 1]?.explanation ?? 'Η ακμή δεν μπορεί να προστεθεί.'
            );
          }}
        >
          + Ακμή
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <button
          type="button"
          className={btnGhost}
          disabled={!selectedNodeId}
          onClick={() => {
            if (!selectedNodeId) {
              setMessage('Επίλεξε κορυφή για διαγραφή.', 'error');
              return;
            }
            const r = GR.removeVertex(data, selectedNodeId);
            commitChange(
              { kind, data: r.graph },
              'Η κορυφή διαγράφηκε.',
              'Αποτυχία διαγραφής.'
            );
            useDsvStore.getState().selectNode(null);
          }}
        >
          Διαγραφή κορυφής
        </button>
        <button
          type="button"
          className={btnGhost}
          disabled={!selectedEdgeId}
          onClick={() => {
            if (!selectedEdgeId) {
              setMessage('Επίλεξε ακμή για διαγραφή.', 'error');
              return;
            }
            const r = GR.removeEdge(data, selectedEdgeId);
            commitChange(
              { kind, data: r.graph },
              'Η ακμή διαγράφηκε.',
              'Αποτυχία διαγραφής ακμής.'
            );
            useDsvStore.getState().selectEdge(null);
          }}
        >
          Διαγραφή ακμής
        </button>
        <button type="button" className={btnGhost} onClick={clearStructure}>
          Από την αρχή
        </button>
      </div>
    </div>
  );
};
