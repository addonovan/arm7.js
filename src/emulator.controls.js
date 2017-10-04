if (Emulator === undefined)
{
    throw new Error("Emulator is not yet defined!");
}

Emulator.controls = {
    running: true,
    timer: 0,

    offset: 0
};

Emulator.controls.restart = function()
{
    Emulator.controls.stop();

    for (var i = 0; i < Emulator.registerCount; i++)
    {
        Emulator.setRegister(i, 0);
    }

    Emulator.hideLine();
    Emulator.controls.offset = 0;
    Emulator.updateLine();

    Emulator.controls.running = true;
    if (Emulator.controls.timer !== 0)
    {
        Emulator.controls.run()
    }
}

Emulator.controls.run = function()
{
    Emulator.controls.timer = setInterval(() =>
    {
        Emulator.controls.step();
    }, 500);
}

Emulator.controls.stop = function()
{
    clearInterval(Emulator.controls.timer);
    Emulator.controls.timer = 0;
}

Emulator.controls.step = function()
{
    if (!Emulator.controls.running)
    {
        return;
    }

    var instruction = Emulator.address[Emulator.controls.offset];
    if (instruction.type !== "instruction")
    {
        Emulator.controls.running = false;
        alert("Out of instructions: Program Terminated");
        return;
    }

    var fun = Emulator.ops[instruction.op.val];

    if (fun === undefined)
    {
        Emulator.controls.running = false;
        alert("Undefined opcode: " + instruction.op.val);
        return;
    }

    fun(instruction.args);

    if (!Emulator.controls.running)
    {
        Emulator.hideLine();
        return;
    }

    Emulator.nextLine();
    Emulator.redraw();
};