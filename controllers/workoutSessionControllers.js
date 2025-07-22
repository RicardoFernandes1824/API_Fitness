const prisma = require('../utils/prisma');

const createSessionFromTemplate = async (req, res) => {
    const { templateId, userId } = req.params;
    try {
        // 1. Fetch the template and its exercises/sets
        const template = await prisma.workoutRoutine.findUnique({
            where: { id: +templateId },
            include: {
                workoutRoutineTemplate: {
                    include: { exercise: true }
                }
            }
        });

        if (!template) return res.status(404).json({ error: 'Template not found' });

        // 2. Create a new training session
        const session = await prisma.trainningSession.create({
            data: {
                workoutId: template.id,
                userId: +userId,
                startTime: new Date()
            }
        });

        // 3. Prepare sets and exercises
        const exercises = [];
        const sets = [];
        for (const t of template.workoutRoutineTemplate) {
            if (!exercises.find(e => e.id === t.exerciseId)) {
                exercises.push({
                    id: t.exerciseId,
                    name: t.exercise.name,
                    imageUrl: t.exercise.imageUrl || null
                });
            }

            for (let i = 1; i <= t.sets; i++) {
                // Correct where clause for previous set
                const prevSet = await prisma.trainningSessionSet.findFirst({
                    where: {
                        exerciseId: t.exerciseId,
                        setNumber: i,
                        trainningSession: {
                            userId: +userId,
                            id: { not: session.id },
                            finished: true // Only finished sessions
                        }
                    },
                    orderBy: { id: 'desc' }
                });

                // Create the set for this session
                const newSet = await prisma.trainningSessionSet.create({
                    data: {
                        setNumber: i,
                        reps: t.reps,
                        weight: 0,
                        sessionId: session.id,
                        exerciseId: t.exerciseId
                    }
                });

                sets.push({
                    id: newSet.id,
                    exerciseId: t.exerciseId,
                    setNumber: i,
                    previousWeight: prevSet ? prevSet.weight : null,
                    previousReps: prevSet ? prevSet.reps : null,
                    weight: 0,
                    reps: t.reps
                });
            }
        }

        res.json({ sessionId: session.id, exercises, sets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const saveSessionResults = async (req, res) => {
    const { sessionId, sets } = req.body; // sets: [{ id, weight, reps }]

    console.log('Saving session results:', sessionId, sets);
    try {
        const session = await prisma.trainningSession.findUnique({
            where: { id: sessionId }
        });
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        for (const set of sets) {
            console.log('Saving set:', set);

            await prisma.trainningSessionSet.create({
                data: {
                    setNumber: set.setNumber || 1,
                    weight: set.weight,
                    reps: set.reps,
                    done: set.done,
                    trainningSession: { connect: { id: sessionId } },
                    exercise: { connect: { id: set.exerciseId } }
                }
            });
        }

        const allDone = sets.every(set => set.done === true);

        if(!allDone) {
            console.log('Not all sets are done');
            return res.status(400).json({ error: 'Not all sets are done' });
        }
        // Fetch all sets for this session
        await prisma.trainningSession.update({
            where: { id: sessionId },
            data: {
                finished: allDone,
                endTime: allDone ? new Date() : null
            }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving session results:', error);
        res.status(500).json({ error: error.message });
    }
};

const saveFullSession = async (req, res) => {
    const { userId, workoutId, startTime, sets } = req.body;
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Create the session
            const session = await prisma.trainningSession.create({
                data: {
                    userId,
                    workoutId,
                    startTime: startTime ? new Date(startTime) : new Date(),
                    finished: false
                }
            });
            // 2. Create all sets for this session
            const createdSets = [];
            for (const set of sets) {
                const createdSet = await prisma.trainningSessionSet.create({
                    data: {
                        trainningSession: { connect: { id: session.id } },
                        exercise: { connect: { id: set.exerciseId } },
                        setNumber: set.setNumber || 1,
                        weight: set.weight,
                        reps: set.reps,
                        done: set.done
                    }
                });
                createdSets.push(createdSet);
            }
            // 3. If all sets are done, mark session as finished
            const allDone = createdSets.every(s => s.done === true);
            if (allDone) {
                await prisma.trainningSession.update({
                    where: { id: session.id },
                    data: {
                        finished: true,
                        endTime: new Date()
                    }
                });
            }
            return { session, sets: createdSets };
        });
        res.json({ success: true, session: result.session, sets: result.sets });
    } catch (error) {
        console.error('Error in saveFullSession:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllSessionsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const sessions = await prisma.trainningSession.findMany({
            where: { userId: +userId },
            orderBy: { startTime: 'desc' },
            include: {
                workout: { select: { name: true } },
                trainningSessionSet: {
                    include: { exercise: { select: { name: true } } },
                    orderBy: { setNumber: 'asc' }
                }
            }
        });
        // Calculate volume for each session
        const sessionsWithVolume = sessions.map(session => {
            const sets = session.trainningSessionSet || [];
            const volume = sets.reduce((sum, set) => sum + (set.weight || 0) * (set.reps || 0), 0);
            return { ...session, volume };
        });
        res.json(sessionsWithVolume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionById = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await prisma.trainningSession.findUnique({
            where: { id: +sessionId },
            include: {
                workout: { select: { name: true } },
                trainningSessionSet: {
                    include: { exercise: { select: { name: true } } },
                    orderBy: { setNumber: 'asc' }
                }
            }
        });
        if (!session) return res.status(404).json({ error: 'Session not found' });
        // Calculate volume
        const sets = session.trainningSessionSet || [];
        const volume = sets.reduce((sum, set) => sum + (set.weight || 0) * (set.reps || 0), 0);
        res.json({ ...session, volume });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createSessionFromTemplate, saveSessionResults, getAllSessionsByUser, getSessionById, saveFullSession }; 