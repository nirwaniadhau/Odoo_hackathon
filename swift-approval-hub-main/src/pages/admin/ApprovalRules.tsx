import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, LogOut, GripVertical, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Approver {
  id: string;
  name: string;
  designation: string;
  required: boolean;
}

interface SortableApproverRowProps {
  approver: Approver;
  index: number;
  onToggleRequired: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableApproverRow = ({ approver, index, onToggleRequired, onDelete }: SortableApproverRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: approver.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-12">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{approver.name}</TableCell>
      <TableCell>{approver.designation}</TableCell>
      <TableCell>
        <Checkbox 
          checked={approver.required}
          onCheckedChange={() => onToggleRequired(approver.id)}
        />
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(approver.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ApprovalRules = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [ruleDescription, setRuleDescription] = useState("Approval rule for miscellaneous expenses");
  const [assignedManager, setAssignedManager] = useState("");
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approversSequence, setApproversSequence] = useState(false);
  const [minPercentage, setMinPercentage] = useState(50);
  const [approvers, setApprovers] = useState<Approver[]>([
    { id: "1", name: "John", designation: "CFO", required: true },
    { id: "2", name: "Mitchell", designation: "Director", required: false },
    { id: "3", name: "Andreas", designation: "Manager", required: false },
  ]);
  const [newApproverName, setNewApproverName] = useState("");
  const [newApproverDesignation, setNewApproverDesignation] = useState("");
  
  const employees = [
    { id: 1, name: "Marc", role: "Employee", manager: "Sarah" },
    { id: 2, name: "Sarah Wilson", role: "Employee", manager: "John Doe" },
    { id: 3, name: "Mark Johnson", role: "Employee", manager: "Sarah Chen" },
  ];

  const managers = [
    { id: 1, name: "Sarah" },
    { id: 2, name: "John Doe" },
    { id: 3, name: "Sarah Chen" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setApprovers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddApprover = () => {
    if (!newApproverName || !newApproverDesignation) {
      toast.error("Please enter approver name and designation");
      return;
    }
    setApprovers([...approvers, { 
      id: Date.now().toString(), 
      name: newApproverName, 
      designation: newApproverDesignation,
      required: false 
    }]);
    setNewApproverName("");
    setNewApproverDesignation("");
    toast.success("Approver added successfully");
  };

  const handleDeleteApprover = (id: string) => {
    setApprovers(approvers.filter(a => a.id !== id));
    toast.success("Approver deleted successfully");
  };

  const handleToggleRequired = (id: string) => {
    setApprovers(approvers.map(a => 
      a.id === id ? { ...a, required: !a.required } : a
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Approval Rules</h1>
              <p className="text-sm text-muted-foreground">Configure expense approval workflows</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/analytics")}>
              Analytics
            </Button>
            <Button variant="outline" onClick={() => navigate("/login")}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Manage Approval Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={selectedEmployee} onValueChange={(value) => {
                setSelectedEmployee(value);
                const employee = employees.find(e => e.name === value);
                if (employee) {
                  setAssignedManager(employee.manager);
                }
              }}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.name}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployee && (
              <>
                {/* Description about rules */}
                <div className="space-y-2">
                  <Label>Description about rules</Label>
                  <Textarea
                    value={ruleDescription}
                    onChange={(e) => setRuleDescription(e.target.value)}
                    className="bg-background min-h-[80px]"
                    placeholder="Enter approval rule description"
                  />
                </div>

                {/* Manager Assignment */}
                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Select value={assignedManager} onValueChange={setAssignedManager}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Assign manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground italic">
                    Dynamic dropdown - Initially the manager set on user record should be set, admin can change manager for approval if required.
                  </p>
                </div>

                {/* Is Manager an Approver */}
                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 bg-muted/30">
                  <Checkbox 
                    id="isManagerApprover"
                    checked={isManagerApprover}
                    onCheckedChange={(checked) => setIsManagerApprover(checked as boolean)}
                  />
                  <Label htmlFor="isManagerApprover" className="cursor-pointer">
                    Is manager an approver?
                  </Label>
                  <p className="text-xs text-destructive ml-auto">
                    If this field is checked then by default the approve request should go to his/her manager first, before going to other approvers
                  </p>
                </div>

                {/* Approvers Section */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Approvers</Label>
                  
                  <div className="border border-border rounded-lg overflow-hidden">
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-12"></TableHead>
                            <TableHead className="font-semibold w-16">Seq</TableHead>
                            <TableHead className="font-semibold">User</TableHead>
                            <TableHead className="font-semibold">Designation</TableHead>
                            <TableHead className="font-semibold w-24">Required</TableHead>
                            <TableHead className="font-semibold w-24">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <SortableContext 
                            items={approvers.map(a => a.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {approvers.map((approver, index) => (
                              <SortableApproverRow
                                key={approver.id}
                                approver={approver}
                                index={index}
                                onToggleRequired={handleToggleRequired}
                                onDelete={handleDeleteApprover}
                              />
                            ))}
                          </SortableContext>
                        </TableBody>
                      </Table>
                    </DndContext>
                  </div>

                  {/* Add Approver Section */}
                  <div className="grid grid-cols-[1fr,1fr,auto] gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <Input
                      placeholder="Approver name"
                      value={newApproverName}
                      onChange={(e) => setNewApproverName(e.target.value)}
                      className="bg-background"
                    />
                    <Input
                      placeholder="Designation"
                      value={newApproverDesignation}
                      onChange={(e) => setNewApproverDesignation(e.target.value)}
                      className="bg-background"
                    />
                    <Button onClick={handleAddApprover}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Approver
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground italic">
                    If the required approver rejects the request, then expense request is auto-rejected.
                  </p>
                </div>

                {/* Approvers Sequence Checkbox */}
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 bg-muted/30">
                  <Checkbox 
                    id="approversSequence"
                    checked={approversSequence}
                    onCheckedChange={(checked) => setApproversSequence(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="approversSequence" className="cursor-pointer font-semibold">
                      Approvers Sequence
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      If this field is ticked true then the above mentioned sequence of approvers matters, 
                      that is first the request goes to John, if he approves/rejects then only request goes 
                      to Mitchell and so on.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      If not ticked then send approver request to all approvers at the same time.
                    </p>
                  </div>
                </div>

                {/* Minimum Approval Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="minPercentage">Minimum Approval percentage: {minPercentage}%</Label>
                  <Input
                    id="minPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={minPercentage}
                    onChange={(e) => setMinPercentage(Number(e.target.value))}
                    className="bg-background max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify the number of percentage approvers required in order to get the request approved.
                  </p>
                </div>

                <Button onClick={() => toast.success("Approval rules updated successfully")} className="w-full">
                  Save Changes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApprovalRules;
