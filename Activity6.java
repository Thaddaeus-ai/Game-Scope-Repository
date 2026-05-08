import java.awt.*;
import javax.swing.*;

public class Activity6 extends JFrame {

    private JTextArea logArea;
    private final JProgressBar progressBar;
    private final JComboBox<String> taskSelector;
    private SwingWorker<Void, Integer> worker;

    public Activity6() {
        setTitle("Task Processor Simulator");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel topPanel = new JPanel();
        topPanel.add(new JLabel("Task Status:"));
        add(topPanel, BorderLayout.NORTH);

        logArea = new JTextArea();
        logArea.setEditable(false);
        add(new JScrollPane(logArea), BorderLayout.CENTER);

        JPanel bottomPanel = new JPanel(new GridLayout(3, 1));
        JPanel comboPanel = new JPanel();
        taskSelector = new JComboBox<>(new String[]{"Short (5s)", "Medium (10s)", "Long (15s)"});
        comboPanel.add(new JLabel("Select Task Duration:"));
        comboPanel.add(taskSelector);

        JPanel buttonPanel = new JPanel();
        JButton startBtn = new JButton("Start Task");
        JButton cancelBtn = new JButton("Cancel Task");
        JButton clearBtn = new JButton("Clear Log");
        buttonPanel.add(startBtn);
        buttonPanel.add(cancelBtn);
        buttonPanel.add(clearBtn);

        progressBar = new JProgressBar(0, 100);
        progressBar.setStringPainted(true);
        bottomPanel.add(comboPanel);
        bottomPanel.add(buttonPanel);
        bottomPanel.add(progressBar);

        add(bottomPanel, BorderLayout.SOUTH);
        startBtn.addActionListener(e -> startTask());
        cancelBtn.addActionListener(e -> cancelTask());
        clearBtn.addActionListener(e -> logArea.setText(""));
        setLocationRelativeTo(null);
        setVisible(true);
}

    private int getDuration() {
        int index = taskSelector.getSelectedIndex();
        if (index == 0) return 5;
        if (index == 1) return 10;
        return 15;
}

    private void startTask() {
        int duration = getDuration();
        logArea.append("Task started...\n");
        worker = new SwingWorker<Void, Integer>() {

 @Override protected Void doInBackground() throws Exception {
                int steps = duration * 10;

                for (int i = 0; i <= steps; i++) {
                    if (isCancelled()) break;
                        int progress = (i * 100) / steps;
                            publish(progress);
                                if (i < steps) {
                                    Thread.sleep(100);
                }
                }
                return null;
            }

            @Override protected void process(java.util.List<Integer> chunks) {
                int value = chunks.get(chunks.size() - 1);
                progressBar.setValue(value);
                logArea.append("Progress: " + value + "%\n");
            }

            @Override
            protected void done() {
                if (isCancelled()) {
                    logArea.append("Task Cancelled\n");
                    progressBar.setValue(0);
                } else {
                    logArea.append("Task Completed\n");
            }
        }
    };

        worker.execute();
}

    private void cancelTask() {
        if (worker != null && !worker.isDone()) {
            worker.cancel(true);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new Activity6());
    }
}